'use strict';

const SqshArtifact = require('./sqsh-artifact');
const StaticArtifact = require('./static-artifact');
const RuntimeArtifact = require('./runtime-artifact');

exports.create = (options) => options.watch ? RuntimeArtifact.create(options) : StaticArtifact.create(options);

exports.create = (options) => {
    if (options.sqsh) {
        return SqshArtifact.create(options);
    }

    return options.watch ? RuntimeArtifact.create(options) : StaticArtifact.create(options)
};
