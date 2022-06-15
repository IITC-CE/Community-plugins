import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import {ajaxGet, check_meta_match_pattern, parseMeta} from 'lib-iitc-manager';

const METABLOCK_RE_HEADER = /==UserScript==\s*([\s\S]*)\/\/\s*==\/UserScript==/m;
const fileExists = async path => !!(await fs.promises.stat(path).catch(() => false));
const orderedDict = (unordered) => Object.keys(unordered).sort().reduce(
    (obj, key) => {
        obj[key] = unordered[key];
        return obj;
    },
    {}
);

const getAllFiles = (dir, ext, getPlugins) =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();

        if (isDirectory && getPlugins === undefined) {
            return [...files, ...getAllFiles(name, ext,true)];
        } else if (!isDirectory && getPlugins === true && file.endsWith(ext)) {
            return [...files, [name, dir.split('/').slice(-1)[0], file]];
        } else {
            return files;
        }
    }, []);

/**
 * Gets a list of all metadata files in repository.
 * Returns an array of arrays: [filepath, id, filename].
 *
 * @return {Array.<Array.<string, string, string>>}
 */
export const get_all_metadata_files = () => {
    return getAllFiles('../metadata', '.yml');
};

const get_all_dist_files = () => {
    return getAllFiles('../dist', '.meta.js');
};

/**
 * Reads and parses metadata file.
 *
 * @param {string} filepath - Path to the metadata file.
 * @returns {Object<string, string>}
 */
export const read_metadata_file = (filepath) => {
    const f = fs.readFileSync(filepath, 'utf8');
    const metadata = YAML.parse(f);
    if (metadata.updateURL === undefined || metadata.downloadURL === undefined) {
        throw new Error(`${filepath} is missing updateURL or downloadURL`);
    }
    return metadata;
};

/**
 * Replaces the .yml extension with ".meta.js" or ".user.js".
 *
 * @param {string} filename - Path to the metadata file.
 * @param {"meta" | "user"} prefix - Prefix to add to the filename.
 * @return {string}
 */
export const ext = (filename, prefix) => {
    return filename.replace(/.yml$/, `.${prefix}.js`);
};

export const is_plugin_update_available = async (metadata, id, filename) => {
    const source_meta_js = await ajaxGet(metadata.updateURL);
    if (source_meta_js === null) throw new Error(`${metadata.updateURL} is not a valid URL`);

    const source_meta = parseMeta(source_meta_js);
    if (source_meta === null) throw new Error(`${metadata.updateURL} is not a valid metadata file`);

    const dist_meta_path = `../dist/${id}/${ext(filename, 'meta')}`;
    if (await fileExists(dist_meta_path)) {
        const dist_meta_js = fs.readFileSync(dist_meta_path, 'utf8');
        const dist_meta = parseMeta(dist_meta_js);
        if (dist_meta === null) throw new Error(`${dist_meta_path} is not a valid metadata file`);

        if (source_meta.version === dist_meta.version) {
            return false;
        }
    }

    return true;
};

const remove_first_line = (str) => {
    return str.substring(str.indexOf('\n') + 1);
};

const replace_update_url = (id, filename) => {
    const base_url = (process.env.BASE_RAW !== undefined) ? process.env.BASE_RAW : 'https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/';
    return {
        updateURL: `${base_url}${id}/${ext(filename, 'meta')}`,
        downloadURL: `${base_url}${id}/${ext(filename, 'user')}`
    };
};

const prepare_meta_js = (meta) => {
    const max_key_length = Object.keys(meta).reduce((max, key) => Math.max(max, key.length), 0);
    const key_padding = max_key_length + 4;

    let meta_js = '// ==UserScript==\n';
    for (let [key, values] of Object.entries(meta)) {
        if (typeof values !== 'object') {
            values = [values];
        }
        for (const value of values) {
            meta_js += `// @${key.padEnd(key_padding)}${value}\n`;
        }
    }
    meta_js += '// ==/UserScript==\n';

    return meta_js;
};

export const update_plugin = async (metadata, id, filename) => {
    const source_plugin_js = await ajaxGet(metadata.downloadURL);
    if (source_plugin_js === null) throw new Error(`${metadata.downloadURL} is not a valid URL`);

    const source_meta = parseMeta(source_plugin_js);
    if (source_meta === null) throw new Error(`${metadata.downloadURL} is not a valid metadata file`);

    const meta = {...source_meta, ...metadata, ...replace_update_url(id, filename)};
    if (!check_meta_match_pattern(meta)) throw new Error(`Not a valid match pattern in ${meta.match} and ${meta.include}`);
    if (meta.name === undefined) throw new Error(`name is missing in ${filename}`);
    meta.id = id;
    for (const mergeKey of ['antiFeatures', 'tags', 'depends']) {
        if (typeof meta[mergeKey] === 'object') {
            meta[mergeKey] = meta[mergeKey].join('|');
        }
    }

    const meta_js = prepare_meta_js(meta);
    let plugin_js = source_plugin_js.replace(METABLOCK_RE_HEADER, '\n'+meta_js);
    plugin_js = remove_first_line(plugin_js);

    await fs.promises.mkdir(`../dist/${id}`, {recursive: true});

    fs.writeFileSync(`../dist/${id}/${ext(filename, 'meta')}`, meta_js);
    fs.writeFileSync(`../dist/${id}/${ext(filename, 'user')}`, plugin_js);

    return meta;
};

export const get_plugins_in_categories = (metadata) => {
    let data = {};

    for (const plugin of metadata) {
        if (plugin.category === undefined) {
            plugin.category = 'Misc';
        }
        if (data[plugin.category] === undefined) {
            data[plugin.category] = [];
        }
        data[plugin.category].push(plugin);
    }

    for (let [, plugins] of Object.entries(data)) {plugins.sort((a, b) => a.name.localeCompare(b.name));}
    return orderedDict(data);
};

const dist_plugin_relative_link = (name, author) => {
    let link = name;
    if (author !== undefined) {
        link += ' by ' + author;
    }
    link = link.toLowerCase();
    link = link.replace(/[^A-Za-z\d -]/g, '');
    link = link.replace(/ /g, '-');
    link = '#'+link;
    return link;
};

export const get_dist_plugins = () => {
    const files = get_all_dist_files();
    const id_link_map = {};
    const plugins = [];
    for (const [filepath, id,] of files) {
        const metajs = fs.readFileSync(filepath, 'utf8');
        const meta = parseMeta(metajs);
        for (const mergeKey of ['antiFeatures', 'tags', 'depends']) {
            if (meta[mergeKey] !== undefined) {
                meta[mergeKey] = meta[mergeKey].split('|');
            }
        }
        id_link_map[id] = dist_plugin_relative_link(meta.name, meta.author);
        plugins.push(meta);
    }

    for (const plugin of plugins) {
        if (plugin['depends'] !== undefined) {
            plugin._depends_links = [];
            for (const depend of plugin['depends']) {
                if (id_link_map[depend] !== undefined) {
                    plugin._depends_links.push([plugin.id, id_link_map[depend]]);
                }
            }
        }
    }

    return get_plugins_in_categories(plugins);
};
