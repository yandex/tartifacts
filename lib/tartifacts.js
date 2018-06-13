'use strict';

const Artifact = require('./artifact');
const config = require('./config');

module.exports = class Tartifacts {
    static create(options) {
        return new Tartifacts(options);
    }

    constructor(options = {}) {
        this._options = options;

        this._artifacts = [];
    }

    writeArtifacts(artifacts = []) {
        return Promise.all([].concat(artifacts).map((options) => {
            const artifact = Artifact.create(config.format(options, this._options));

            this._artifacts.push(artifact);

            return artifact.write();
        }));
    }

    closeArtifacts() {
        return Promise.all(this._artifacts.map((artifact) => artifact.close()));
    }
};
