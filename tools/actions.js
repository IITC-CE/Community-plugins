import * as helpers from "./helpers.js";

export const run_update = async (metadata_files) => {
    for (const [filepath, id, filename] of metadata_files) {
        console.log(`Checking ${id}/${filename}`);
        const metadata = helpers.read_metadata_file(filepath);

        if (await helpers.is_plugin_update_available(metadata, id, filename)) {
            console.log(`Updating ${id}/${filename}`);
            await helpers.update_plugin(metadata, id, filename);
        } else {
            console.log(`${id}/${filename} is up to date`);
        }
    }
}
