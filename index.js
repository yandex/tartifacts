'use strict';

const path = require('path');

const workerFarm = require('worker-farm');
const each = require('async-each');

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
        dotFiles: true,
        emptyFiles: true,
        emptyDirs: true
    };
    const opts = Object.assign(defaults, options);

    opts.root = path.resolve(opts.root || process.cwd());

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    // do not use child processes for one artifact
    if (artifacts.length === 1) {
        return new Promise((resolve, reject) => {
            writeArtifact(artifacts[0], opts, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    const writeArtifactWorkers = workerFarm(require.resolve('./lib/write-artifact'));

    return new Promise((resolve, reject) => {
        each(artifacts, (artifact, callback) => writeArtifactWorkers(artifact, opts, callback), (err) => {
            workerFarm.end(writeArtifactWorkers);

            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
};
