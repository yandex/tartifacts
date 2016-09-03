'use strict';

const promisify = require('es6-promisify');
const each = promisify(require('async-each'));

const writeArtifact = require('./lib/write-artifact');

/**
 * Creates and writes artifacts to fs.
 *
 * @param {object[]} artifacts          The artifacts info.
 * @param {object}   [options]          Options.
 * @param {string}   [options.root]     The path to root directory. By default is cwd.
 * @param {boolean}  [options.dot]      Include dotfiles.
 * @returns {Promise}
 */
module.exports = (artifacts, options) => {
    artifacts || (artifacts = []);
    options || (options = {});

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    return each(artifacts, (artifact, callback) => writeArtifact(artifact, options, callback));
};
