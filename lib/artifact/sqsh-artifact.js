'use strict';

const path = require('path');
const { execSync } = require('child_process');
const StaticArtifact = require('./static-artifact');

module.exports = class SqshArtifact extends StaticArtifact {
    get _destDir() {
        return path.dirname(this._options.path)
    }

    _write() {
        const data = [];

        return new Promise((resolve, reject) => {
            const readStream = this._createReadStream();

            readStream.on('error', reject);
            readStream.on('close', resolve);
            readStream.on('data', (chunk) => data.push(chunk))
        })
        .then(() => {
            console.log(data);
        })
    }  
};
