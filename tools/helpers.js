import fs from 'fs';
import path from 'path';
import vm from 'vm';
import {execFileSync} from 'child_process';
import {applyPatch} from 'diff';
import YAML from 'yaml';
import {fetchData, checkMetaMatchPattern, parseMeta} from 'lib-iitc-manager';

const REPO_DIR = '..';

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

/**
 * Converts the line endings of the plugin source code to LF, so that everything
 * published uses the same ones no matter what the author writes with.
 *
 * @param {string} plugin_js - Plugin source code.
 * @return {string}
 */
export const normalize_eol = (plugin_js) => plugin_js.replace(/\r\n?/g, '\n');

const PATCH_HEADER_RE = /^#\s*([A-Za-z][A-Za-z-]*)\s*:\s*(.*)$/;
const PATCH_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})Z?$/;
const REQUIRED_PATCH_HEADERS = {reason: 'Reason', createdForVersion: 'Created-For-Version', patchDate: 'Patch-Date'};

/**
 * Warnings collected while applying patches, as {path, message} objects.
 * Also printed as GitHub workflow annotations, see warn_patch().
 *
 * @type {Array.<Object<string, string>>}
 */
export const patch_warnings = [];

const warn_patch = (patch, message) => {
    const patch_path = path.relative(REPO_DIR, patch.path);
    patch_warnings.push({path: patch_path, message});
    console.log(`::warning file=${patch_path}::${message}`);
};

/**
 * Builds the version stamp appended to the version of a patched plugin.
 *
 * @param {Object<string, string>} headers - Parsed patch headers.
 * @return {string} Stamp in the "YYYYMMDD.HHMMSS" form.
 */
export const patch_stamp = (headers) => {
    const match = PATCH_DATE_RE.exec(headers.patchDate);
    if (match === null) throw new Error(`invalid Patch-Date "${headers.patchDate}", expected "YYYY-MM-DD HH:MM:SS"`);

    const [, year, month, day, hours, minutes, seconds] = match;
    return `${year}${month}${day}.${hours}${minutes}${seconds}`;
};

/**
 * Parses a patch file: a preamble of "# Key: value" comments followed by a unified diff.
 *
 * @param {string} text - Contents of the patch file.
 * @return {{headers: Object<string, string>, diff: string}}
 */
export const parse_patch = (text) => {
    const lines = text.split('\n');
    const headers = {};

    let diff_start = 0;
    for (; diff_start < lines.length; diff_start++) {
        const line = lines[diff_start];
        if (line.trim() === '') continue;
        if (!line.startsWith('#')) break;

        const match = PATCH_HEADER_RE.exec(line);
        if (match === null) throw new Error(`unparsable header line "${line}"`);
        headers[match[1].toLowerCase().replace(/-(.)/g, (_, char) => char.toUpperCase())] = match[2].trim();
    }

    for (const [key, name] of Object.entries(REQUIRED_PATCH_HEADERS)) {
        if (!headers[key]) throw new Error(`missing the required "${name}" header`);
    }
    patch_stamp(headers);

    const diff = lines.slice(diff_start).join('\n');
    if (!/^--- /m.test(diff)) throw new Error('no unified diff found (missing a "--- " line)');
    if (!/^@@ /m.test(diff)) throw new Error('the diff is empty (no hunks)');

    return {headers, diff};
};

/**
 * Applies a patch to the plugin source code.
 * The context has to match exactly (fuzzFactor: 0): once upstream touches the patched
 * code the patch stops applying, which is how an obsolete patch is detected.
 *
 * @param {string} source - Plugin source code.
 * @param {{diff: string}} patch - Patch as returned by parse_patch().
 * @return {{code: string, applied: boolean}}
 */
export const apply_patch = (source, patch) => {
    const code = applyPatch(source, patch.diff, {fuzzFactor: 0});
    return code === false ? {code: source, applied: false} : {code: code, applied: true};
};

/**
 * Builds the version a plugin is published under: the upstream version, stamped
 * with the patch date when the plugin is patched.
 *
 * @param {string} source_version - Version from the upstream metablock.
 * @param {?{headers: Object<string, string>}} patch - Patch as returned by read_patch(), or null.
 * @return {string}
 */
export const patched_version = (source_version, patch) => {
    if (patch === null || typeof source_version !== 'string' || source_version === '') return source_version;
    return `${source_version}.${patch_stamp(patch.headers)}`;
};

/**
 * Returns the path to the patch of a plugin, or null when the plugin is not patched.
 *
 * @param {string} author - Author name.
 * @param {string} filename - Name of the metadata file.
 * @return {?string}
 */
export const get_patch_path = (author, filename) => {
    const patch_path = `../patches/${author}/${filename.replace(/\.yml$/, '.patch')}`;
    return fs.existsSync(patch_path) ? patch_path : null;
};

/**
 * Reads and parses the patch of a plugin.
 *
 * @param {string} author - Author name.
 * @param {string} filename - Name of the metadata file.
 * @return {?{headers: Object<string, string>, diff: string, path: string}}
 */
export const read_patch = (author, filename) => {
    const patch_path = get_patch_path(author, filename);
    if (patch_path === null) return null;

    try {
        return {...parse_patch(fs.readFileSync(patch_path, 'utf8')), path: patch_path};
    } catch (e) {
        throw new Error(`${patch_path}: ${e.message}`);
    }
};

export const is_plugin_update_available = async (metadata, author, filename) => {
    const source_meta_js = await fetchData(metadata.updateURL);
    if (source_meta_js === null) throw new Error(`${metadata.updateURL} is not a valid URL`);

    const source_meta = parseMeta(source_meta_js);
    if (source_meta === null) throw new Error(`${metadata.updateURL} is not a valid metadata file`);

    const expected_version = patched_version(source_meta.version, read_patch(author, filename));

    const dist_meta_path = `../dist/${author}/${ext(filename, 'meta')}`;
    if (await fileExists(dist_meta_path)) {
        const dist_meta_js = fs.readFileSync(dist_meta_path, 'utf8');
        const dist_meta = parseMeta(dist_meta_js);
        if (dist_meta === null) throw new Error(`${dist_meta_path} is not a valid metadata file`);

        if (expected_version === dist_meta.version) {
            return false;
        }
    }

    return true;
};

const remove_first_line = (str) => {
    return str.substring(str.indexOf('\n') + 1);
};

const get_repo_urls = (downloadURL) => {
    let match = downloadURL.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\//) ||
                downloadURL.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\//);
    if (match) return {
        homepageURL: `https://github.com/${match[1]}`,
        issueTracker: `https://github.com/${match[1]}/issues`
    };

    match = downloadURL.match(/^https:\/\/gitlab\.com\/([^/]+\/[^/]+)\//);
    if (match) return {
        homepageURL: `https://gitlab.com/${match[1]}`,
        issueTracker: `https://gitlab.com/${match[1]}/-/issues`
    };

    return null;
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

const assert_valid_syntax = (code, filename) => new vm.Script(code, {filename});

/**
 * Applies the patch to the plugin source code downloaded from upstream.
 *
 * @param {string} source_plugin_js - Plugin source code from upstream.
 * @param {Object<string, string>} source_meta - Metadata parsed from that source code.
 * @param {Object<string, *>} patch - Patch as returned by read_patch().
 * @return {?string} Patched source code, or null when the patch no longer applies.
 */
const patch_plugin = (source_plugin_js, source_meta, patch) => {
    const {code, applied} = apply_patch(source_plugin_js, patch);
    if (!applied) {
        warn_patch(patch, `does not apply to version ${source_meta.version} anymore, the plugin is published unpatched`);
        return null;
    }

    if (JSON.stringify(parseMeta(code)) !== JSON.stringify(source_meta)) {
        throw new Error(`${patch.path} must not change the ==UserScript== block, use the metadata file for that`);
    }
    assert_valid_syntax(code, patch.path);

    if (source_meta.version !== patch.headers.createdForVersion) {
        warn_patch(patch,
            `was created for version ${patch.headers.createdForVersion} `+
            `and still applies to ${source_meta.version}, check whether it is still needed`);
    }

    return code;
};

export const update_plugin = async (metadata, author, filename) => {
    const downloaded_plugin_js = await fetchData(metadata.downloadURL);
    if (downloaded_plugin_js === null) throw new Error(`${metadata.downloadURL} is not a valid URL`);

    const source_plugin_js = normalize_eol(downloaded_plugin_js);
    const source_meta = parseMeta(source_plugin_js);
    if (source_meta === null) throw new Error(`${metadata.downloadURL} is not a valid metadata file`);

    const patch = read_patch(author, filename);
    const patched_plugin_js = patch !== null ? patch_plugin(source_plugin_js, source_meta, patch) : null;

    const meta = {...{author}, ...source_meta, ...metadata, ...replace_update_url(author, filename)};
    if (meta.skipMatchCheck !== true && !checkMetaMatchPattern(meta)) throw new Error(`Not a valid match pattern in ${meta.match} and ${meta.include}`);
    if (meta.skipMatchCheck) {delete meta.skipMatchCheck;}
    if (meta.name === undefined) throw new Error(`name is missing in ${filename}`);
    meta.id = filename.replace(/\.yml$/, '')+'@'+author;
    for (const mergeKey of ['antiFeatures', 'depends', 'recommends']) {
        if (typeof meta[mergeKey] === 'object') {
            meta[mergeKey] = meta[mergeKey].join('|');
        }
    }

    if (meta.homepageURL === undefined || meta.issueTracker === undefined) {
        const repoUrls = get_repo_urls(metadata.downloadURL);
        if (repoUrls !== null) {
            if (meta.homepageURL === undefined) meta.homepageURL = repoUrls.homepageURL;
            if (meta.issueTracker === undefined) meta.issueTracker = repoUrls.issueTracker;
        }
    }

    if (patched_plugin_js !== null) {
        if (source_meta.version !== undefined) meta.version = patched_version(source_meta.version, patch);
        meta.patch = patch.headers.reason;
    }

    const meta_js = prepare_meta_js(meta);
    let plugin_js = (patched_plugin_js ?? source_plugin_js).replace(METABLOCK_RE_HEADER, () => '\n'+meta_js);
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

// Maps each repo-relative dist file to the ISO date of the last commit that
// changed it (single newest-first `git log` pass, so the first hit wins).
// Returns null when git history is unavailable (e.g. not a git checkout).
const get_dist_commit_dates = () => {
    try {
        const out = execFileSync('git', ['log', '--format=commit:%cI', '--name-only', '--', 'dist'],
            {cwd: REPO_DIR, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
        const dates = new Map();
        let commit = null;
        for (const line of out.split('\n')) {
            if (line.startsWith('commit:')) commit = line.slice('commit:'.length);
            else if (line && commit && !dates.has(line)) dates.set(line, commit);
        }
        return dates;
    } catch {
        console.warn('git history unavailable; falling back to file mtime for updatedAt');
        return null;
    }
};

// Repo-relative dist paths with uncommitted changes, i.e. regenerated this run.
const get_dirty_dist_files = () => {
    try {
        const out = execFileSync('git', ['status', '--porcelain', '--', 'dist'], {cwd: REPO_DIR, encoding: 'utf8'});
        const dirty = new Set();
        for (const line of out.split('\n')) {
            if (!line) continue;
            const entry = line.slice(3); // strip the "XY " status prefix
            const arrow = entry.indexOf(' -> '); // renames read as "old -> new"
            dirty.add(arrow === -1 ? entry : entry.slice(arrow + 4));
        }
        return dirty;
    } catch {
        return null;
    }
};

// Real "last updated" time of a plugin. Both .meta.js and .user.js are checked,
// because an author may change the code without bumping the version (then only
// .user.js changes). Files regenerated this run, or a missing git history, fall
// back to the filesystem mtime.
const get_plugin_updated_at = (meta_path, commit_dates, dirty_files) => {
    const meta_rel = path.relative(REPO_DIR, meta_path);
    const user_rel = meta_rel.replace(/\.meta\.js$/, '.user.js');

    if (dirty_files === null || dirty_files.has(meta_rel) || dirty_files.has(user_rel)) {
        return fs.statSync(meta_path).mtime.toISOString();
    }
    if (commit_dates) {
        const dates = [commit_dates.get(meta_rel), commit_dates.get(user_rel)].filter(Boolean).map(d => new Date(d));
        if (dates.length) return new Date(Math.max(...dates)).toISOString();
    }
    return fs.statSync(meta_path).mtime.toISOString();
};

export const get_dist_plugins = async () => {
    const files = get_all_dist_files();
    const commit_dates = get_dist_commit_dates();
    const dirty_files = get_dirty_dist_files();
    const community_plugins_ids = [];
    const plugins = [];
    for (const [filepath, ,] of files) {
        const metajs = fs.readFileSync(filepath, 'utf8');

        const meta = parseMeta(metajs);
        for (const mergeKey of ['antiFeatures', 'depends', 'recommends']) {
            if (meta[mergeKey] !== undefined) {
                meta[mergeKey] = meta[mergeKey].split('|');
            }
        }
        meta.description = remove_brackets(meta.description || "");
        meta.id_hash = meta.id.replace("@", "-by-");
        community_plugins_ids.push(meta.id_hash);
        meta.updatedAt = get_plugin_updated_at(filepath, commit_dates, dirty_files);
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
