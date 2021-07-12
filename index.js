const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const glob = require('@actions/glob');
const base64 = require('base-64');

(async () => {
    try {
        const subject = core.getInput('subject');
        const repository = core.getInput('repository');
        const package = core.getInput('package');
        const version = core.getInput('version');
        const versionDesc = core.getInput('versionDesc');
        const username = core.getInput('username');
        const override = core.getInput('override');
        const apiKey = core.getInput('apiKey');
        const sourcePath = core.getInput('sourcePath');
        const destinationPath = core.getInput('destinationPath');
        const showInDownloads = core.getInput('showInDownloads');

        if (!apiKey){
            core.warning('apiKey was not set. Skipping the upload.');
            return;
        }

        {  /* create version */
            const url = 'https://api.bintray.com/' +
                `/packages/${subject}/${repository}/${package}/versions`;
            const bintrayVersionDesc = versionDesc ?
                versionDesc : `Version ${version}`;
            const data = {name: version, desc: bintrayVersionDesc};
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Basic ' +
                       base64.encode (`${username}:${apiKey}`),
                    'Content-Type': 'application/json'
                }
            };
            const response = await fetch(url, options);
            console.log('Create version: ', response);
        }

        const globber = await glob.create(sourcePath);

        for await (const file of globber.globGenerator()) {
            const basename = path.basename(file);
            const bintrayPath = destinationPath ?
                `${destinationPath}/${basename}` : basename;
            const url = 'https://api.bintray.com/' +
                `/content/${subject}/${repository}/${bintrayPath}`;
            const size = fs.statSync(file).size;
            const options = {
                method: 'PUT',
                body: fs.createReadStream(file),
                headers: {
                    'Authorization': 'Basic ' +
                        base64.encode (`${username}:${apiKey}`),
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': size,
                    'X-Bintray-Package': package,
                    'X-Bintray-Version': version,
                    'X-Bintray-Publish': 1,
                    'X-Bintray-Override': override
                }
            };
            const response = await fetch(url, options);

            if (response.ok) {
                console.log(`Uploaded ${bintrayPath}.`);
            } else {
                console.log('Error:', response);
                core.setFailed('Upload failed');
            };

            if (showInDownloads && showInDownloads.toString() == '1') {
                const metaUrl = 'https://api.bintray.com/' +
                    `/file_metadata/${subject}/${repository}/${bintrayPath}`;
                const metaOptions = {
                    method: 'PUT',
                    body: '{ "list_in_downloads": true }',
                    headers: {
                        'Authorization': 'Basic ' +
                            base64.encode (`${username}:${apiKey}`),
                        'Content-Type': 'application/json'
                    }
                };
                const metaResponse = await fetch(metaUrl, metaOptions);

                if (response.ok) {
                    console.log(`File shown in download list: ${bintrayPath}.`);
                } else {
                    console.log('Error:', response);
                    core.setFailed('Error adding file to download list');
                };
            }

        };
    } catch (error) {
        core.setFailed(error.message);
    }
})();
