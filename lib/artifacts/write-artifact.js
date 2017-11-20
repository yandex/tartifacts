'use strict';

const path = require('path');

const proxyquire = require('proxyquire');
const fs = require('graceful-fs');
const makeDir = require('make-dir');
const globStream = proxyquire('glob-stream', {
    'glob': proxyquire('glob', { 'fs': fs })
});

const ArtifactTask = require('./artifact-task');
const TarStream = require('../streams/tar-stream');
const CopyStream = require('../streams/copy-stream');

/**
 * Creates and writes artifact to fs.
 *
 * @param {object}   artifact            The artifact info.
 * @param {string}   [artifact.dest]     The path to destination file or directory.
 * @param {string}   [artifact.name]     The name of destination file or directory.
 * @param {string[]} [artifact.patterns] The glob patterns to files which need to be included or excluded.
 *                                       To exclude files use negative patterns.
 * @param {string[]} [artifact.includes] The glob patterns to files which need to be included.
 * @param {string[]} [artifact.excluded] The glob patterns to files which need to be excluded.
 * @param {object}   [options]                 The artifact options.
 * @param {boolean}  [options.tar]             If `true`, destination directory will be packed to tarball file.
 *                                             Otherwise files of artifact will be copied to destination directory.
 *                                             If `true`, tarball file will be gzipped.
 * @param {boolean}  [options.gzip]            Gzip destination tarball file.
 * @param {string}   [options.root='cwd']      The path to root directory. By default is cwd.
 * @param {boolean}  [options.dotFiles=true]   Include dotfiles.
 * @param {boolean}  [options.emptyFiles=true] Include empty files.
 * @param {boolean}  [options.emptyDirs=true]  Include empty directories.
 * @param {Function} callback                  The callback function.
 */
module.exports = function (artifact, options, callback) {
    if (arguments.length === 1) { callback = artifact; }
    if (arguments.length === 2) { callback = options;  }

    const artifactTask = new ArtifactTask(artifact, options);
    const artifactInfo = artifactTask.artifact;
    const artifactSettings = artifactTask.settings;
    const destDir = artifactSettings.tar ? path.dirname(artifactInfo.path) : artifactInfo.path;

    makeDir(destDir, { fs }).then(() => {
        const readStream = new globStream(artifactInfo.patterns, {
            cwd: artifactInfo.root,
            dot: artifactSettings.dotFiles,
            nosort: true,
            nodir: !artifactSettings.emptyDirs,
            follow: true
        });
        const writeStream = artifactSettings.tar
            ? new TarStream(artifactInfo.path, artifactSettings)
            : new CopyStream(artifactInfo.path, {
                emptyFiles: artifactSettings.emptyFiles,
                emptyDirs: artifactSettings.emptyDirs
            });

        readStream.on('error', callback);

        writeStream
            .on('error', callback)
            .on('close', () => callback(null));

        readStream.pipe(writeStream);
    })
    .catch(callback);
};
