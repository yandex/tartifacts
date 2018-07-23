'use strict';

const StaticArtifact = require('./static-artifact');
const DelayedArtifact = require('./delayed-artifact');

exports.create = (options) => options.watch ? DelayedArtifact.create(options) : StaticArtifact.create(options);
