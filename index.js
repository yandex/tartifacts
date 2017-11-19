'use strict';

const workerFarm = require('worker-farm');
const each = require('async-each');

const writeArtifact = require('./lib/artifacts').write;

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

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    // do not use child processes for one artifact
    if (artifacts.length === 1) {
        return new Promise((resolve, reject) => {
            writeArtifact(artifacts[0], options, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    const writeArtifactWorkers = workerFarm(require.resolve('./lib/write-artifact'));

    return new Promise((resolve, reject) => {
        each(artifacts, (artifact, callback) => writeArtifactWorkers(artifact, options, callback), (err) => {
            workerFarm.end(writeArtifactWorkers);

            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
};
