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
 * @param {boolean}  [options.dotFiles=false]    Include dotfiles.
 * @param {boolean}  [options.emptyFiles=false]  Include empty files.
 * @returns {Promise}
 */
module.exports = (artifacts, options) => {
    artifacts || (artifacts = []);

    const defaults = {
        root: process.cwd(),
        dotFiles: false,
        emptyFiles: false
    };
    const opts = Object.assign(defaults, options);

    opts.root = path.resolve(opts.root);

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    return each(artifacts, (artifact, callback) => writeArtifact(artifact, opts, callback));
};
