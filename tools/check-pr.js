import {run_update} from './actions.js';
import {exec} from 'child_process';
import fs from 'fs';
import {check_duplicate_plugins, ext} from './helpers.js';

const proc = await exec('git --no-pager diff --name-only FETCH_HEAD $(git merge-base FETCH_HEAD master)');

let updated_files = '';
proc.stdout.on('data', (chunk) => {
    updated_files += chunk.toString();
});

proc.on('exit', async () => {
    updated_files = updated_files.split('\n');

    const metadata_files = [];
    for (const file of updated_files) {
        if (file.startsWith('metadata/')) {
            const [, author, filename] = file.split('/');
            metadata_files.push(['../' + file, author, filename]);
        }
    }
    const is_updated = await run_update(metadata_files);
    check_duplicate_plugins();

    let message = "";
    if (is_updated) {
        message = '### Changes are detected:\n';
        for (const [, author, filename] of metadata_files) {
            try {
                const meta = fs.readFileSync(`../dist/${author}/${ext(filename, 'meta')}`, 'utf8');
                message += `**${author}/${ext(filename, 'meta')}**\n\`\`\`\n${meta}\n\`\`\`\n---\n`;
            } catch {
                message += `**${author}/${ext(filename, 'meta')}**\nDeleted\n---\n`;
            }
        }
    } else {
        message = '### No changes are detected';
    }

    console.log(message);
    fs.writeFileSync('../check_pr_output', message);
});
