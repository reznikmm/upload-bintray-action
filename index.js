const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const glob = require('@actions/glob');

try {
    const repository = core.getInput('repository');
    const package = core.getInput('package');
    const version = core.getInput('version');
    const username = core.getInput('username');
    const override = core.getInput('override');
    const apiKey = core.getInput('apiKey');
    const sourcePath = core.getInput('sourcePath');

    const globber = await glob.create(sourcePath);

    for await (const file of globber.globGenerator()) {
        const basename = path.basename(file);
        const url = 'https://api.bintray.com/' +
          `/content/${username}/${repository}/${basename}`;
        const size = fs.statSync(file).size;
        const options = {
            method: 'PUT', 
            body: fs.createReadStream (file),
            auth: `${username}:${apiKey}`,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': size,
                'X-Bintray-Package': package,
                'X-Bintray-Version': version,
                'X-Bintray-Publish': 1,
                'X-Bintray-Override': override
            }
        };
        const response = await fetch(ulr, options);
        
        if (response.ok) {
            console.log(`Uploaded ${basename}.`);
        } else {
            console.log('Error:', response);
            core.setFailed('Upload failed');
        };
    };
} catch (error) {
    core.setFailed(error.message);
}
