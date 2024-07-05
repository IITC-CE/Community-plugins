import * as helpers from './helpers.js';
import nunjucks from 'nunjucks';
import fs from 'fs';
import {get_dist_plugins, get_plugins_in_categories, get_stat_counters} from './helpers.js';

export const run_update = async (metadata_files) => {
    let is_updated = false;
    for (const [filepath, author, filename] of metadata_files) {
        console.log(`Checking ${author}/${filename}`);
        const metadata = helpers.read_metadata_file(filepath);

        if (metadata === null) continue;
        if (await helpers.is_plugin_update_available(metadata, author, filename)) {
            console.log(`Updating ${author}/${filename}`);
            await helpers.update_plugin(metadata, author, filename);
            is_updated = true;
        } else {
            console.log(`${author}/${filename} is up to date`);
        }
    }
    return is_updated;
};

export const render_readme = () => {
    const template = fs.readFileSync('templates/README.njk', 'utf8');
    const plugins = get_dist_plugins();
    const markers = get_stat_counters(plugins);
    markers.collection = get_plugins_in_categories(plugins);

    nunjucks.configure({ autoescape: true });
    const readme = nunjucks.renderString(template, markers);

    fs.writeFileSync('../README.md', readme);
    console.log('README.md updated');
};

export const make_plugins_json = () => {
    const plugins = get_dist_plugins();
    const meta_data = {
        plugins,
        version: 2
    };
    fs.writeFileSync('../dist/meta.json', JSON.stringify(meta_data, null, 2));
};
