'use strict';

const StaticArtifact = require('./static-artifact');
const RuntimeArtifact = require('./runtime-artifact');

exports.create = (options) => options.watch ? RuntimeArtifact.create(options) : StaticArtifact.create(options);
