import * as helpers from './helpers.js';
import nunjucks from 'nunjucks';
import fs from 'fs';
import {get_dist_plugins, get_stat_counters} from './helpers.js';

export const run_update = async (metadata_files, force = false) => {
    for (const [filepath, author, filename] of metadata_files) {
        console.log(`Checking ${author}/${filename}`);
        const metadata = helpers.read_metadata_file(filepath);

        if (force || await helpers.is_plugin_update_available(metadata, author, filename)) {
            console.log(`Updating ${author}/${filename}`);
            await helpers.update_plugin(metadata, author, filename);
        } else {
            console.log(`${author}/${filename} is up to date`);
        }
    }
};

export const make_plugins_list = () => {
    const template = fs.readFileSync('templates/README.njk', 'utf8');
    const plugins = get_dist_plugins();
    const markers = get_stat_counters(plugins);
    markers.collection = plugins;

    nunjucks.configure({ autoescape: true });
    const readme = nunjucks.renderString(template, markers);

    fs.writeFileSync('../README.md', readme);
    console.log('README.md updated');
};
