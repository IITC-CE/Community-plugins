# Patches

A patch is a unified diff applied to the plugin source downloaded from its author, before it is published to `dist`.
See [Patches](/CONTRIBUTING.md#patches) for when this is appropriate.

One patch per plugin, named after its metadata file: `metadata/Zaso/player-ranges.yml` -> `patches/Zaso/player-ranges.patch`.

## Creating and updating a patch

```
cd tools
npm run patch:start -- Zaso/player-ranges
```

This downloads the plugin into `patches/.work/Zaso/player-ranges`: `a.user.js` is the pristine source, `b.user.js` is the copy to edit.
Make the smallest change that fixes the problem in `b.user.js`, leave `a.user.js` untouched, then:

```
npm run patch:save -- Zaso/player-ranges --reason='jQuery 4 removed $.isNumeric()' --upstream=https://github.com/author/repo/issues/42
```

The same two commands update an existing patch. `b.user.js` then already contains it, and `--reason` and `--upstream` are taken from the current patch when omitted.

## Preamble

`patch:save` writes the headers of the patch, there is no need to edit them by hand:

- `Reason` - why the patch exists. Ends up in `dist/meta.json`, in IITC Community plugins and in README.md.
- `Upstream` - link to the issue reported to the author. Optional, but a patch is not a replacement for telling the author.
- `Created-For-Version` - the version the patch was written against. A patch that still applies to a newer version is reported as possibly obsolete.
- `Patch-Date` - the timestamp appended to the published version.

## Versioning

Userscript managers only offer an update when the version changes, and a patch does not change the version of the author.
So a patched plugin is published under the upstream version with the patch date appended:

```
0.3.1  ->  0.3.1.20260727.104500
```

That version is also what tells the build system whether the plugin has to be republished, so a patch changed without its `Patch-Date` being bumped has no effect at all.

## Rules

- Never edit `dist` by hand, it is regenerated from the source of the author on every build.
- A patch must not change the "==UserScript==" block, use `metadata/<author>/<plugin>.yml` for metadata.
- Keep the patch minimal, it has to survive the author releasing new versions.
- Do not edit a patch by hand, run the two commands again instead. Its context is compared byte for byte, and an editor that trims trailing whitespace on save is enough to break it.

## When a patch stops applying

The context has to match exactly, so the patch stops applying as soon as the author touches the patched code.
The plugin is then published unpatched, with a warning in the build log and in the comment of the pull request.

Check whether the fix is still needed. If it is, create the patch again; if the author fixed the problem, delete `patches/<author>/<plugin>.patch` and the plugin gets published as is.
