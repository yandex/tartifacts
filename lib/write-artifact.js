'use strict';

const path = require('path');
const assert = require('assert');

const globStream = require('glob-stream');
const mkdirp = require('mkdirp');

const TarStream = require('./tar-stream');
const FileCopyStream = require('./copy-file-stream');

const cwd = process.cwd();

/**
 * Creates and writes artifact to fs.
 *
 * @param {object}   artifact             The artifact info.
 * @param {string}   artifact.dest        The path to destination file or directory.
 * @param {string[]} [artifact.patterns]  The paths to files which need to be included or excluded.
 * @param {string[]} [artifact.includes]  The paths to files which need to be included.
 * @param {string[]} [artifact.excludes]  The paths to files which need to be excluded.
 * @param {boolean}  [artifact.tar]       If `true`, destination directory will be packed to tarball file.
 *                                        Otherwise files of artifact will be copied to destination directory.
 *                                        If `true`, tarball file will be gzipped.
 * @param {boolean}  [artifact.gzip]      Gzip destination tarball file.
 * @param {object}   [options]            The options.
 * @param {string}   [options.root]       The path to root directory. By default is cwd.
 * @param {boolean}  [options.dotFiles]   Include dotfiles.
 * @param {boolean}  [options.emptyFiles] Include empty files.
 * @returns {Promise}
 */
module.exports = (artifact, options) => {
    options || (options = {});
    artifact || (artifact = {});

    assert(artifact.dest, 'You should specify the dest for artifact.');
    assert(artifact.includes || artifact.patterns,
        'You should specify the includes or patterns parameters for artifact.');

    const root = options.root ? path.resolve(options.root) : cwd;
    const dest = path.resolve(root, artifact.dest);
    const includes = Array.isArray(artifact.includes) ? artifact.includes : [].concat(artifact.includes || []);
    const excludes = Array.isArray(artifact.excludes) ? artifact.excludes : [].concat(artifact.excludes || []);
    const patterns = [].concat(
        Array.isArray(artifact.patterns) ? artifact.patterns : [].concat(artifact.patterns || []),
        includes,
        excludes.map(pattern => isNegativePattern(pattern) ? pattern : `!${pattern}`)
    );

    if (includes.some(isNegativePattern)) {
        throw new Error('The includes parameter of artifact should not contains negative patterns.');
    }

    if (isNegativePattern(patterns[0])) {
        throw new Error('The first pattern of artifact should not be is negative.');
    }

    return new Promise((resolve, reject) => {
        const dir = artifact.tar ? path.dirname(dest) : dest;

        mkdirp(dir, err => {
            if (err) { return reject(err); }

            resolve();
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            const readStream = globStream.create(patterns, { cwd: root, base: root, dot: options.dotFiles });
            const writeStream = artifact.tar
                ? new TarStream(dest, { gzip: artifact.gzip, emptyFiles: options.emptyFiles })
                : new FileCopyStream(dest, { emptyFiles: options.emptyFiles });

            readStream.on('error', reject);

            writeStream
                .on('error', reject)
                .on(artifact.tar ? 'close' : 'finish', resolve);

            readStream.pipe(writeStream);
        });
    });
};

function isNegativePattern(pattern) {
    return pattern.charAt(0) === '!';
}
