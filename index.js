'use strict';

const path = require('path');

const promisify = require('es6-promisify');
const each = promisify(require('async-each'));

const writeArtifact = require('./lib/write-artifact');

/**
 * Creates and writes artifacts to fs.
 *
 * @param {object[]} artifacts                   The artifacts info.
 * @param {object}   [options]                   Options.
 * @param {string}   [options.root=cwd]          The path to root directory. By default is cwd.
 * @param {boolean}  [options.dotFiles=true]     Include dotfiles.
 * @param {boolean}  [options.emptyFiles=true]   Include empty files.
 * @param {boolean}  [options.emptyDirs=true]    Include empty directories.
 * @returns {Promise}
 */
module.exports = (artifacts, options) => {
    artifacts || (artifacts = []);

    const defaults = {
        root: process.cwd(),
        dotFiles: true,
        emptyFiles: true,
        emptyDirs: true
    };
    const opts = Object.assign(defaults, options);

    opts.root = path.resolve(opts.root);

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    return each(artifacts, (artifact, callback) => writeArtifact(artifact, opts, callback));
};
