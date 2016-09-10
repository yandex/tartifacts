'use strict';

const path = require('path');

const mkdirp = require('mkdirp');
const copy = require('copy');

const ArtifactStream = require('./artifact-stream');

/**
 * Copy artifact stream.
 *
 * Stream writes artifact files to destination directory.
 *
 * @extends ArtifactStream
 */
module.exports = class CopyArtifactStream extends ArtifactStream {
    /**
     * Create copy artifact stream.
     *
     * @param {string}  dest               The path to destination directory.
     * @param {object}  options            The options.
     * @param {boolean} options.emptyFiles Include empty files.
     * @param {boolean} options.emptyDirs  Include empty directories.
     */
    constructor(dest, options) {
        super(dest, options);
    }
    /**
     * Copies directory (without its files and subdirs) to destination directory.
     *
     * Keeps original path relative to cwd.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} dir — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addDirectory(dir, callback) {
        const dirname = path.join(this._dest, dir.relative);

        mkdirp(dirname, callback);
    }
    /**
     * Copies file to destination directory.
     *
     * Keeps original path relative to cwd.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} file — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addFile(file, callback) {
        copy.one(file.path, this._dest, { srcBase: file.cwd }, callback);
    }
};
