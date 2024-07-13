import {render_readme, make_plugins_json, run_update} from './actions.js';
import {get_all_metadata_files} from './helpers.js';

const metadata_files = get_all_metadata_files();
if (await run_update(metadata_files) || process.env.FORCE_RENDER !== undefined) {
    render_readme().then();
    make_plugins_json().then();
}
