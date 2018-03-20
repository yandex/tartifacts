'use strict';

const path = require('path');
const assert = require('assert');

const fs = require('graceful-fs');
const cpFile = require('cp-file');
const makeDir = require('make-dir');

const copySymlink = require('../fs/copy-symlink');

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
     * @param {Vinyl} dir — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addDirectory(dir, callback) {
        const dirname = path.join(this._dest, dir.cwdRelative);

        makeDir(dirname, { fs })
            .then(() => callback())
            .catch(callback);
    }
    /**
     * Copies file to destination directory.
     *
     * Keeps original path relative to cwd.
     *
     * @param {Vinyl} file — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addFile(file, callback) {
        const dest = path.join(this._dest, file.cwdRelative);

        cpFile(file.history[0], dest)
            .then(() => callback())
            .catch(callback);
    }
    /**
     * Adds symlink to artifact.
     *
     * @param {Vinyl} file — the file info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    addSymbolicLink(file, callback) {
        const dest = path.join(this._dest, file.cwdRelative);

        copySymlink(file.history[0], dest, { fs })
            .then(() => callback())
            .catch(callback);
    }
};
