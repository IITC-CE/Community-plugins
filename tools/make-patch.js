import fs from 'fs';
import {applyPatch, createTwoFilesPatch} from 'diff';
import {fetchData, parseMeta} from 'lib-iitc-manager';
import {apply_patch, normalize_eol, parse_patch, read_metadata_file, read_patch} from './helpers.js';

const fail = (message) => {
    console.error(message);
    process.exit(1);
};

const usage = () => fail([
    'Usage: npm run patch:start -- <author>/<plugin>',
    '       npm run patch:save -- <author>/<plugin> --reason="why the patch is needed" [--upstream=<issue url>]'
].join('\n'));

const [command, target, ...flags] = process.argv.slice(2);
if (!['start', 'save'].includes(command) || target === undefined || !target.includes('/')) usage();

const flag = (key) => {
    const found = flags.find((arg) => arg.startsWith(`--${key}=`));
    return found === undefined ? undefined : found.slice(key.length + 3);
};

const [author, name] = target.split('/');
const filename = `${name}.yml`;
const metadata_path = `../metadata/${author}/${filename}`;
const metadata = read_metadata_file(metadata_path);
if (metadata === null) fail(`${metadata_path} does not exist`);

const work_dir = `../patches/.work/${author}/${name}`;
const pristine_path = `${work_dir}/a.user.js`;
const edited_path = `${work_dir}/b.user.js`;

if (command === 'start') {
    const downloaded = await fetchData(metadata.downloadURL);
    if (downloaded === null) fail(`${metadata.downloadURL} is not a valid URL`);

    const source = normalize_eol(downloaded);
    const patch = read_patch(author, filename);
    const {code, applied} = patch === null ? {code: source, applied: false} : apply_patch(source, patch);

    fs.mkdirSync(work_dir, {recursive: true});
    fs.writeFileSync(pristine_path, source);
    fs.writeFileSync(edited_path, code);

    console.log(`Downloaded ${metadata.downloadURL}`);
    if (patch !== null) {
        console.log(applied
            ? 'The current patch is already applied to it'
            : 'The current patch does not apply anymore and was left out, it has to be made again');
    }
    console.log(`Now edit ${edited_path} and run:`);
    console.log(`  npm run patch:save -- ${target} --reason="why the patch is needed"`);
} else {
    if (!fs.existsSync(edited_path)) fail(`${edited_path} does not exist, run "npm run patch:start -- ${target}" first`);

    const pristine = normalize_eol(fs.readFileSync(pristine_path, 'utf8'));
    const edited = normalize_eol(fs.readFileSync(edited_path, 'utf8'));
    if (pristine === edited) fail(`${edited_path} is unchanged, there is nothing to save`);

    const source_meta = parseMeta(pristine);
    if (source_meta === null || source_meta.version === undefined) fail(`${pristine_path} has no version in its ==UserScript== block`);
    if (JSON.stringify(parseMeta(edited)) !== JSON.stringify(source_meta)) {
        fail(`${edited_path} changes the ==UserScript== block, use ${metadata_path} for that`);
    }

    const previous = read_patch(author, filename);
    const reason = flag('reason') ?? previous?.headers.reason;
    const upstream = flag('upstream') ?? previous?.headers.upstream;
    if (reason === undefined) fail('--reason="why the patch is needed" is required');

    const preamble = [`# Reason: ${reason}`];
    if (upstream !== undefined) preamble.push(`# Upstream: ${upstream}`);
    preamble.push(`# Created-For-Version: ${source_meta.version}`);
    preamble.push(`# Patch-Date: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`);

    const diff = createTwoFilesPatch(`a/${name}.user.js`, `b/${name}.user.js`, pristine, edited).replace(/^=+\n/, '');
    const text = `${preamble.join('\n')}\n${diff}`;

    const patch = parse_patch(text);
    if (applyPatch(pristine, patch.diff, {fuzzFactor: 0}) !== edited) fail('the generated patch does not reproduce the edited file');

    fs.mkdirSync(`../patches/${author}`, {recursive: true});
    fs.writeFileSync(`../patches/${author}/${name}.patch`, text);
    fs.rmSync(work_dir, {recursive: true, force: true});

    console.log(`Wrote patches/${author}/${name}.patch`);
}
