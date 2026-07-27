# How can I add a plugin to this list?

## Hosting

Plugins are usually developed and stored in usable form in the code repositories of their authors.

You can use both github and other version control systems or host the plugin on your own site.

You only need to make sure the plugin is always available to our catalog build system and have the following fields in the "==UserScript==" block: `updateURL`, `downloadURL`.

## Adding the plugin to catalog

- Clone this repository.
- In `metadata` folder, create a folder with the name of plugin's author.
- Inside create a file `[filename].yml`. For example, `minimap.yml`.
- Then, using YAML syntax, describe at least 2 mandatory fields: `updateURL` and `downloadURL`. Example:

```yaml
updateURL: https://iitc.app/build/release/plugins/cache-portals-on-map.meta.js
downloadURL: https://iitc.app/build/release/plugins/cache-portals-on-map.user.js
```

- You can also overwrite values from the "==UserScript==" blocks or add new values. See [Possible key types](#possible-key-types).
- Make sure that your plugin does not use features that could be dangerous to the user. Otherwise you need to specify them in the `antiFeatures` key. See [Anti-features](#anti-features).
- Make a commit and send a PR with the changes to this repository.

### Possible key types

Mandatory:

- `updateURL`
- `downloadURL`

Conditional:

- `name` - Usually plugins have the `name` key in the "==UserScript==" block. If your plugin does not have this key, it must be specified.
- `antiFeatures` - If your plugin uses dangerous features, you should list them. [Anti-features](#anti-features).

Optional:

- `preview` - A preview image for your plugin.
- `issueTracker` - Link to issue tracker of plugin. (automatically generated if `downloadURL` points to GitHub or GitLab)
- `depends` - List of plugins required for your plugin to work. As values, specify the `id` of the required plugins.
- `recommends` - List of plugins recommended for your plugin to work. As values, specify the `id` of the recommended plugins.
- `skipMatchCheck` - Set to "true" if the plugin is not intended to run on intel/missions sites.

You can also override or add keys frequently used in the "==UserScript==" block:

- `homepageURL` (automatically generated if `downloadURL` points to GitHub or GitLab)
- `match`
- `include`

etc...

### Anti-features

The use of IITC is a "gray area" for Niantic ToS.
To some extent it is a violation of the rules, but it is a popular tool and does not carry the risk of account blocking.
This is partly because IITC behaves like a stock Ingress Intel map and tries not to violate ToS.

Nevertheless, some third-party plugins may be more dangerous for the user.
IITC Community plugins allows to place such plugins in its directory, but it is necessary to specify which dangerous features are used.
This will allow users prepared for the risk of account blocking to use such plugins and protect ordinary users.

List of dangerous features:

- `scraper` - The plugin makes additional requests for more information than is explicitly requested by the user. For example, it infects full information about portals that the user has not clicked on.
- `highLoad` - The plugin makes many more requests than the usual Intel/IITC use.
- `export` - The plugin allows you to export Niantic data (excluding debugging purposes).

### Example of using multiple keys

```yml
updateURL: https://iitc.app/build/release/plugins/some-plugin.meta.js
downloadURL: https://iitc.app/build/release/plugins/some-plugin.user.js
antiFeatures:
  - scraper
  - highLoad
issueTracker: https://github.com/JohnSmith/ingress-plugins/issues
depends:
  - player-inventory@jaiperdu
author: JohnSmith
match:
  - https://intel.ingress.com/*
```

## Patches

Some plugins need a small fix to keep working, for example because of an API removed from a library that IITC ships, while their author no longer responds.
For those the catalog can carry a patch: a diff stored in [patches](/patches) and applied to the plugin source before it is published.

A patch is appropriate when the fix is small and mechanical and the author was told about the problem but did not react.
It is not a way to add features or to rewrite a plugin, fork it and point `downloadURL` at your fork instead.
Report the problem to the author first and link that issue in the patch, even if the repository looks abandoned.

Patched plugins are marked as such: a `patch` key in `dist/meta.json`, a `patch` line in the "==UserScript==" block and a note in README.md.
The patch date is appended to the version of the author, so that userscript managers see the update.

See [patches/README.md](/patches/README.md) for how to create one.
