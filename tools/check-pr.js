import {run_update} from './actions.js';
import {exec} from 'child_process';
import fs from 'fs';
import {ext} from './helpers.js';

const proc = await exec('git --no-pager diff --name-only FETCH_HEAD $(git merge-base FETCH_HEAD master)');

let updated_files = "";
proc.stdout.on('data', (chunk) => {
    updated_files += chunk.toString();
});

proc.on('exit', async (code) => {
    updated_files = updated_files.split('\n');

    const metadata_files = [];
    for (const file of updated_files) {
        if (file.startsWith('metadata/')) {
            const [, id, filename] = file.split('/');
            metadata_files.push(["../" + file, id, filename]);
        }
    }
    await run_update(metadata_files, true);

    let message = "### Changes are detected:\n";
    for (const [, id, filename] of metadata_files) {
        const meta = fs.readFileSync(`../dist/${id}/${ext(filename, "meta")}`, 'utf8');
        message += `**${id}/${ext(filename, "meta")}**\n\`\`\`\n${meta}\n\`\`\`\n---\n`;
    }

    console.log(message);
});
