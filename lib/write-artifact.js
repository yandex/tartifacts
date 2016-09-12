'use strict';

const path = require('path');

const proxyquire = require('proxyquire');
const mkdirp = require('mkdirp');
const globStream = proxyquire('glob-stream', {
    'glob': proxyquire('glob', {
        'fs': require('graceful-fs')
    })
});

const normalizeArtifact = require('./normalize-artifact');
const TarArtifactStream = require('./streams/tar-artifact-stream');
const CopyArtifactStream = require('./streams/copy-artifact-stream');

/**
 * Creates and writes artifact to fs.
 *
 * @param {object}   artifact             The artifact info.
 * @param {string}   artifact.dest        The path to destination file or directory.
 * @param {string[]} [artifact.patterns]  The paths to files which need to be included.
 *                                        To exclude files use negative patterns.
 * @param {boolean}  [artifact.tar]       If `true`, destination directory will be packed to tarball file.
 *                                        Otherwise files of artifact will be copied to destination directory.
 *                                        If `true`, tarball file will be gzipped.
 * @param {boolean}  [artifact.gzip]      Gzip destination tarball file.
 * @param {object}   options              The options.
 * @param {string}   options.root         The path to root directory. By default is cwd.
 * @param {boolean}  options.dotFiles     Include dotfiles.
 * @param {boolean}  options.emptyFiles   Include empty files.
 * @param {boolean}  options.emptyDirs    Include empty directories.
 * @param {function} callback             The callback.
 */
module.exports = function (artifact, options, callback) {
    if (arguments.length === 1) { callback = artifact; }
    if (arguments.length === 2) { callback = options;  }

    const normalizedArtifact = normalizeArtifact(artifact);
    const dest = normalizedArtifact.dest;
    const dir = normalizedArtifact.tar ? path.dirname(dest) : dest;
    const isArchive = normalizedArtifact.tar;

    mkdirp(dir, err => {
        if (err) { return callback(err); }

        const readStream = globStream.create(normalizedArtifact.patterns, {
            cwd: options.root,
            dot: options.dotFiles,
            nosort: true,
            nodir: !options.emptyDirs,
            follow: true
        });
        const writeStream = isArchive
            ? new TarArtifactStream(dest, {
                gzip: normalizedArtifact.gzip,
                emptyFiles: options.emptyFiles,
                emptyDirs: options.emptyDirs
            })
            : new CopyArtifactStream(dest, {
                emptyFiles: options.emptyFiles,
                emptyDirs: options.emptyDirs
            });

        readStream.on('error', callback);

        writeStream
            .on('error', callback)
            .on(normalizedArtifact.tar ? 'close' : 'finish', () => callback(null));

        readStream.pipe(writeStream);
    });
};
