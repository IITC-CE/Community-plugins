import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTwoFilesPatch} from 'diff';
import {apply_patch, parse_patch, patch_stamp, patched_version} from './helpers.js';

const PREAMBLE = [
    '# Reason: jQuery 4 removed $.trim()',
    '# Upstream: https://example.com/issues/1',
    '# Created-For-Version: 0.1.1.20200216.174029',
    '# Patch-Date: 2026-07-26 14:30:00'
].join('\n');

const DIFF = [
    '--- a/demo.user.js',
    '+++ b/demo.user.js',
    '@@ -1,3 +1,3 @@',
    ' first',
    '-second',
    '+patched',
    ' third',
    ''
].join('\n');

const patch_text = (preamble = PREAMBLE, diff = DIFF) => `${preamble}\n${diff}`;

const SOURCE = [
    '// ==UserScript==',
    '// @name            Demo',
    '// @version         0.1.0',
    '// ==/UserScript==',
    '',
    'function demo(value) {',
    '    var msg = $.trim(value);',
    '    return msg;',
    '}',
    ''
].join('\n');

const PATCHED_SOURCE = SOURCE.replace('$.trim(value)', "(value || '').trim()");

const demo_patch = () => parse_patch(patch_text(PREAMBLE, createTwoFilesPatch('a/demo.user.js', 'b/demo.user.js', SOURCE, PATCHED_SOURCE)));

test('parse_patch reads the preamble and separates it from the diff', () => {
    const patch = parse_patch(patch_text());

    assert.deepEqual(patch.headers, {
        reason: 'jQuery 4 removed $.trim()',
        upstream: 'https://example.com/issues/1',
        createdForVersion: '0.1.1.20200216.174029',
        patchDate: '2026-07-26 14:30:00'
    });
    assert.equal(patch.diff, DIFF);
});

test('parse_patch requires Reason, Created-For-Version and Patch-Date', () => {
    const lines = PREAMBLE.split('\n');
    for (const [index, name] of [[0, 'Reason'], [2, 'Created-For-Version'], [3, 'Patch-Date']]) {
        const preamble = lines.filter((_, i) => i !== index).join('\n');
        assert.throws(() => parse_patch(patch_text(preamble)), new RegExp(`missing the required "${name}" header`));
    }
});

test('parse_patch keeps the Upstream header optional', () => {
    const preamble = PREAMBLE.split('\n').filter((line) => !line.startsWith('# Upstream')).join('\n');
    assert.equal(parse_patch(patch_text(preamble)).headers.upstream, undefined);
});

test('parse_patch rejects a patch without a diff or without hunks', () => {
    assert.throws(() => parse_patch(PREAMBLE), /missing a "--- " line/);
    assert.throws(() => parse_patch(patch_text(PREAMBLE, '--- a/demo.user.js\n+++ b/demo.user.js\n')), /the diff is empty/);
});

test('patch_stamp turns Patch-Date into a numeric version suffix', () => {
    assert.equal(patch_stamp({patchDate: '2026-07-26 14:30:00'}), '20260726.143000');
    assert.equal(patch_stamp({patchDate: '2026-07-26T14:30:00Z'}), '20260726.143000');

    for (const patchDate of ['2026-07-26', '26.07.2026 14:30:00', 'yesterday', undefined]) {
        assert.throws(() => patch_stamp({patchDate: patchDate}), /invalid Patch-Date/);
    }
});

test('patched_version appends the stamp only for patched plugins', () => {
    const patch = parse_patch(patch_text());

    assert.equal(patched_version('0.1.1.20200216.174029', patch), '0.1.1.20200216.174029.20260726.143000');
    assert.equal(patched_version('0.1.1.20200216.174029', null), '0.1.1.20200216.174029');
});

test('patched_version leaves plugins without an upstream version alone', () => {
    const patch = parse_patch(patch_text());

    assert.equal(patched_version(undefined, patch), undefined);
    assert.equal(patched_version('', patch), '');
});

test('apply_patch patches the source code', () => {
    const result = apply_patch(SOURCE, demo_patch());

    assert.equal(result.applied, true);
    assert.equal(result.code, PATCHED_SOURCE);
});

test('apply_patch tolerates the patched code moving to another line', () => {
    const result = apply_patch(`// a new comment from upstream\n${SOURCE}`, demo_patch());

    assert.equal(result.applied, true);
    assert.equal(result.code, `// a new comment from upstream\n${PATCHED_SOURCE}`);
});

test('apply_patch reports failure and keeps the source when upstream changed the context', () => {
    const source = SOURCE.replace('return msg;', 'return msg.toUpperCase();');
    const result = apply_patch(source, demo_patch());

    assert.equal(result.applied, false);
    assert.equal(result.code, source);
});
