import {run_update} from './actions.js';
import {exec} from 'child_process';
import fs from 'fs';
import {parseMeta} from 'lib-iitc-manager';
import {check_duplicate_plugins, ext, patch_stamp, patch_warnings, read_patch} from './helpers.js';

const proc = await exec('git --no-pager diff --name-only FETCH_HEAD $(git merge-base FETCH_HEAD master)');

let updated_files = '';
proc.stdout.on('data', (chunk) => {
    updated_files += chunk.toString();
});

proc.on('exit', async () => {
    updated_files = updated_files.split('\n');

    const metadata_files = new Map();
    const changed_patches = new Set();
    for (const file of updated_files) {
        const [dir, author, name] = file.split('/');
        if (name === undefined) continue;

        let filename = null;
        if (dir === 'metadata' && name.endsWith('.yml')) filename = name;
        if (dir === 'patches' && name.endsWith('.patch')) filename = name.replace(/\.patch$/, '.yml');
        if (filename === null) continue;

        metadata_files.set(`${author}/${filename}`, [`../metadata/${author}/${filename}`, author, filename]);
        if (dir === 'patches') changed_patches.add(`${author}/${filename}`);
    }

    // A patch that changed without its Patch-Date being bumped keeps the version the plugin
    // is already published under, so nothing would be republished.
    const warnings = [];
    for (const key of changed_patches) {
        const [author, filename] = key.split('/');
        const patch = read_patch(author, filename);
        const dist_meta_path = `../dist/${author}/${ext(filename, 'meta')}`;
        if (patch === null || !fs.existsSync(dist_meta_path)) continue;

        const dist_meta = parseMeta(fs.readFileSync(dist_meta_path, 'utf8'));
        if (dist_meta !== null && dist_meta.version.endsWith(`.${patch_stamp(patch.headers)}`)) {
            warnings.push({
                path: `patches/${author}/${filename.replace(/\.yml$/, '.patch')}`,
                message: 'the patch was changed but its Patch-Date was not, so the plugin will not be republished'
            });
        }
    }

    const is_updated = await run_update([...metadata_files.values()]);
    check_duplicate_plugins();
    warnings.push(...patch_warnings);

    let message = '';
    if (warnings.length > 0) {
        message += `> [!WARNING]\n${warnings.map(({path, message}) => `> **${path}**: ${message}`).join('\n')}\n\n`;
    }
    if (is_updated) {
        message += '### Changes are detected:\n';
        for (const [, author, filename] of metadata_files.values()) {
            try {
                const meta = fs.readFileSync(`../dist/${author}/${ext(filename, 'meta')}`, 'utf8');
                message += `**${author}/${ext(filename, 'meta')}**\n\`\`\`\n${meta}\n\`\`\`\n---\n`;
            } catch {
                message += `**${author}/${ext(filename, 'meta')}**\nDeleted\n---\n`;
            }
        }
    } else {
        message += '### No changes are detected';
    }

    console.log(message);
    fs.writeFileSync('../check_pr_output', message);
});
