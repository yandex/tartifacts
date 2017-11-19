'use strict';

const path = require('path');
const assert = require('assert');

const mkdirp = require('mkdirp');
const copy = require('copy');

const AbstractWritableStream = require('./abstract-writable-stream');

/**
 * Copy stream.
 *
 * Stream writes files to destination directory.
 *
 * Input readable stream should have object chunks with file info in vinyl format.
 *
 * @extends ArtifactStream
 */
module.exports = class CopyStream extends AbstractWritableStream {
    /**
     * Creates copy stream.
     *
     * @param {string}  dest                      The path to destination directory.
     * @param {object}  [options]                 The options.
     * @param {boolean} [options.emptyFiles=true] Include empty files.
     * @param {boolean} [options.emptyDirs=true]  Include empty directories.
     */
    constructor(dest, options) {
        super(dest, options);

        assert(dest, 'You should specify the destination path to directory.');

        this.once('finish', () => this.emit('close'));
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
