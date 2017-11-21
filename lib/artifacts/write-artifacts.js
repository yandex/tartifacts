'use strict';

const writeArtifact = require('./write-artifact');

/**
 * Creates and writes artifact to fs.
 *
 * @param {object|object[]} artifacts The artifacts info
 * @param {object}   [options]                 The artifact options.
 * @param {boolean}  [options.tar]             If `true`, destination directory will be packed to tarball file.
 *                                             Otherwise files of artifact will be copied to destination directory.
 *                                             If `true`, tarball file will be gzipped.
 * @param {boolean}  [options.gzip]            Gzip destination tarball file.
 * @param {boolean}  [options.dotFiles=true]   Include dotfiles.
 * @param {boolean}  [options.emptyFiles=true] Include empty files.
 * @param {boolean}  [options.emptyDirs=true]  Include empty directories.
 * @returns {Promise}
 */
module.exports = function (artifacts, options) {
    artifacts || (artifacts = []);

    if (!Array.isArray(artifacts)) {
        artifacts = [artifacts];
    }

    return Promise.all(artifacts.map(artifact => writeArtifact(artifact, options)));
};
