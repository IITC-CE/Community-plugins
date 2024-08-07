import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import {ajaxGet, check_meta_match_pattern, parseMeta} from 'lib-iitc-manager';

const METABLOCK_RE_HEADER = /==UserScript==\s*([\s\S]*)\/\/\s*==\/UserScript==/m;
const fileExists = async path => !!(await fs.promises.stat(path).catch(() => false));
const metaKeysAtBottom = ['include', 'match', 'grant'];
const sortMeta = (a, b) => {
    if (metaKeysAtBottom.includes(a)) return 1;
    if (metaKeysAtBottom.includes(b)) return -1;
    return 0;
};
const orderedDict = (unordered, sort_fn) => Object.keys(unordered).sort(sort_fn).reduce(
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
 * Returns an array of arrays: [filepath, author, filename].
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
    let metadata;
    try {
        const f = fs.readFileSync(filepath, 'utf8');
        metadata = YAML.parse(f);
    } catch {
        return null;
    }
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

export const is_plugin_update_available = async (metadata, author, filename) => {
    const source_meta_js = await ajaxGet(metadata.updateURL);
    if (source_meta_js === null) throw new Error(`${metadata.updateURL} is not a valid URL`);

    const source_meta = parseMeta(source_meta_js);
    if (source_meta === null) throw new Error(`${metadata.updateURL} is not a valid metadata file`);

    const dist_meta_path = `../dist/${author}/${ext(filename, 'meta')}`;
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

const replace_update_url = (author, filename) => {
    const base_url = (process.env.BASE_RAW !== undefined) ? process.env.BASE_RAW : 'https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/';
    return {
        updateURL: `${base_url}${author}/${ext(filename, 'meta')}`,
        downloadURL: `${base_url}${author}/${ext(filename, 'user')}`
    };
};

const prepare_meta_js = (meta) => {
    const max_key_length = Object.keys(meta).reduce((max, key) => Math.max(max, key.length), 0);
    const key_padding = max_key_length + 4;

    let meta_js = '// ==UserScript==\n';
    for (let [key, values] of Object.entries(orderedDict(meta, sortMeta))) {
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

export const update_plugin = async (metadata, author, filename) => {
    const source_plugin_js = await ajaxGet(metadata.downloadURL);
    if (source_plugin_js === null) throw new Error(`${metadata.downloadURL} is not a valid URL`);

    const source_meta = parseMeta(source_plugin_js);
    if (source_meta === null) throw new Error(`${metadata.downloadURL} is not a valid metadata file`);

    const meta = {...{author}, ...source_meta, ...metadata, ...replace_update_url(author, filename)};
    if (meta.skipMatchCheck !== true && !check_meta_match_pattern(meta)) throw new Error(`Not a valid match pattern in ${meta.match} and ${meta.include}`);
    if (meta.skipMatchCheck) {delete meta.skipMatchCheck;}
    if (meta.name === undefined) throw new Error(`name is missing in ${filename}`);
    meta.id = filename.replace(/\.yml$/, '')+'@'+author;
    for (const mergeKey of ['antiFeatures', 'depends', 'recommends']) {
        if (typeof meta[mergeKey] === 'object') {
            meta[mergeKey] = meta[mergeKey].join('|');
        }
    }

    const meta_js = prepare_meta_js(meta);
    let plugin_js = source_plugin_js.replace(METABLOCK_RE_HEADER, '\n'+meta_js);
    plugin_js = remove_first_line(plugin_js);

    await fs.promises.mkdir(`../dist/${author}`, {recursive: true});

    fs.writeFileSync(`../dist/${author}/${ext(filename, 'meta')}`, meta_js);
    fs.writeFileSync(`../dist/${author}/${ext(filename, 'user')}`, plugin_js);

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

const get_core_plugins_unique_ids = async () => {
    const core_meta_response = await fetch("https://iitc.app/build/release/meta.json")
    if (!core_meta_response.ok) {
        throw new Error(`Response status: ${core_meta_response.status}`);
    }
    const ids = [];
    const core_meta = await core_meta_response.json();
    for (const cat in core_meta["categories"]) {
        const category = core_meta.categories[cat]
        if (category.plugins !== undefined) {
            for (const pl of category.plugins) {
                const hash = pl.id+"-by-"+pl.author
                ids.push(hash);
            }
        }
    }
    return ids;
}

const remove_brackets = (input) => {
  if (input.startsWith('[')) {
    const endIndex = input.indexOf('] ');
    if (endIndex !== -1) {
      return input.slice(endIndex + 2);
    }
  }
  return input;
}

export const get_dist_plugins = async () => {
    const files = get_all_dist_files();
    const community_plugins_ids = [];
    const plugins = [];
    for (const [filepath, ,] of files) {
        const metajs = fs.readFileSync(filepath, 'utf8');
        const dist_stats = fs.statSync(filepath);

        const meta = parseMeta(metajs);
        for (const mergeKey of ['antiFeatures', 'depends', 'recommends']) {
            if (meta[mergeKey] !== undefined) {
                meta[mergeKey] = meta[mergeKey].split('|');
            }
        }
        meta.description = remove_brackets(meta.description || "");
        meta.id_hash = meta.id.replace("@", "-by-");
        community_plugins_ids.push(meta.id_hash);
        meta.updatedAt = dist_stats.mtime.toISOString();
        plugins.push(meta);
    }

    const core_plugins_ids = await get_core_plugins_unique_ids();

    for (const plugin of plugins) {
        if (plugin['depends'] !== undefined) {
            plugin._depends_links = [];
            for (const depend of plugin['depends']) {
                const dep_hash = depend.replace("@", "-by-");
                const dep_info = {
                    id: depend,
                    hash: null,
                    source: null
                }
                if (core_plugins_ids.includes(dep_hash)) {
                    dep_info.hash = dep_hash;
                    dep_info.source = "core";
                } else if (community_plugins_ids.includes(dep_hash)) {
                    dep_info.hash = dep_hash;
                    dep_info.source = "community";
                }
                plugin._depends_links.push(dep_info);
            }
        }
        if (plugin['recommends'] !== undefined) {
            plugin._recommends_links = [];
            for (const recommend of plugin['recommends']) {
                const dep_hash = recommend.replace("@", "-by-");
                const dep_info = {
                    id: recommend,
                    hash: null,
                    source: null
                }
                if (core_plugins_ids.includes(dep_hash)) {
                    dep_info.hash = dep_hash;
                    dep_info.source = "core";
                } else if (community_plugins_ids.includes(dep_hash)) {
                    dep_info.hash = dep_hash;
                    dep_info.source = "community";
                }
                plugin._recommends_links.push(dep_info);
            }
        }
    }

    return plugins;
};

export const check_duplicate_plugins = () => {
    const urls = [];
    const metadata_files = get_all_metadata_files();
    for (const [filepath, author, filename] of metadata_files) {
        console.log(`Checking ${author}/${filename}`);
        const metadata = read_metadata_file(filepath);
        if (metadata === null) continue;
        if (metadata.downloadURL in urls) {throw new Error(`Duplicate plugin ${author}/${filename}`);}
        urls.push(metadata.downloadURL);
    }
};

export const get_stat_counters = (plugins) => {
    let count_plugins = plugins.length;
    let authors = [];

    for (const plugin of plugins) {
        if (plugin.author !== undefined && !authors.includes(plugin.author)) {
            authors.push(plugin.author);
        }
    }

    return {count_plugins: count_plugins, count_authors: authors.length};
};
