'use strict';

const Tartifacts = require('./tartifacts');

function writeArtifacts(artifacts, options) {
    const tartifacts = new Tartifacts(options);

    return tartifacts.writeArtifacts(artifacts);
}

writeArtifacts.Tartifacts = Tartifacts;

module.exports = writeArtifacts;
