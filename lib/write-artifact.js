'use strict';

const path = require('path');
const assert = require('assert');

const globStream = require('glob-stream');
const mkdirp = require('mkdirp');

const TarStream = require('./streams/tar-stream');
const CopyStream = require('./streams/copy-stream');

const cwd = process.cwd();

/**
 * Adds to patterns includes and excludes.
 *
 * Note: the exclude patterns will be transformed to negative patterns.
 *
 * @param {string[]} patterns — the paths to files which need to be included or excluded.
 * @param {string[]} includes — the paths to files which need to be included.
 * @param {string[]} excludes — the paths to files which need to be excluded.
 *
 * @returns {string[]}
 */
function clarifyPatterns(patterns, includes, excludes) {
    const entireIncludes = Array.isArray(includes) ? includes : [].concat(includes || []);
    const entireExcludes = Array.isArray(excludes) ? excludes : [].concat(excludes || []);

    const entirePatterns = [].concat(
        Array.isArray(patterns) ? patterns : [].concat(patterns || []),
        entireIncludes,
        entireExcludes.map(pattern => isNegativePattern(pattern) ? pattern : `!${pattern}`)
    );

    if (entireIncludes.some(isNegativePattern)) {
        throw new Error('The includes parameter of artifact should not contains negative patterns.');
    }

    if (isNegativePattern(entirePatterns[0])) {
        throw new Error('The first pattern of artifact should not be is negative.');
    }

    return entirePatterns;
}

/**
 * Returns `true` if pattern is negative.
 *
 * @param {string} pattern — the pattern with to files which need to be included or excluded.
 *
 * @returns {Boolean}
 */
function isNegativePattern(pattern) {
    return pattern.charAt(0) === '!';
}

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
 * @param {function} callback             The callback.
 */
module.exports = function (artifact, options, callback) {
    if (arguments.length === 1) { callback = artifact; }
    if (arguments.length === 2) { callback = options;  }

    artifact || (artifact = {});
    options || (options = {});

    assert(artifact.dest, 'You should specify the dest for artifact.');
    assert(artifact.includes || artifact.patterns,
        'You should specify the includes or patterns parameters for artifact.');

    const patterns = clarifyPatterns(artifact.patterns, artifact.includes, artifact.excludes);
    const root = options.root ? path.resolve(options.root) : cwd;
    const dest = path.resolve(root, artifact.dest);
    const dir = artifact.tar ? path.dirname(dest) : dest;

    mkdirp(dir, err => {
        if (err) { return callback(err); }

        const readStream = globStream.create(patterns, {
            cwd: root,
            base: root,
            dot: options.dotFiles,
            nosort: true
        });
        const writeStream = artifact.tar
            ? new TarStream(dest, { gzip: artifact.gzip, emptyFiles: options.emptyFiles })
            : new CopyStream(dest, { emptyFiles: options.emptyFiles });

        readStream.on('error', callback);

        writeStream
            .on('error', callback)
            .on(artifact.tar ? 'close' : 'finish', () => callback(null));

        readStream.pipe(writeStream);
    });
};
