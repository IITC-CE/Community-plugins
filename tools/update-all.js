import {render_readme, make_plugins_json, run_update} from './actions.js';
import {get_all_metadata_files} from './helpers.js';

const metadata_files = get_all_metadata_files();
const force = process.env.FORCE_UPDATE !== undefined;
if (await run_update(metadata_files, force) || force) {
    render_readme().then();
    make_plugins_json().then();
}
