'use strict';

const path = require('path');
const stream = require('stream');

const fs = require('graceful-fs');

const defaults = {
    emptyFiles: true,
    emptyDirs: true
};

/**
 * Abstract writable stream.
 *
 * Input readable stream should have object chunks with file info in vinyl format.
 *
 * @extends stream.Writable
 */
module.exports = class AbstractWritableStream extends stream.Writable {
    /**
     * Create artifact stream.
     *
     * @param {string}  dest                      The path to destination file or directory.
     * @param {object}  [options]                 The options.
     * @param {boolean} [options.emptyFiles=true] Include empty files.
     * @param {boolean} [options.emptyDirs=true]  Include empty directories.
     */
    constructor(dest, options) {
        const opts = Object.assign(defaults, options);

        super({ objectMode: true });

        this._followSymlinks = opts.followSymlinks;
        this._emptyFiles = opts.emptyFiles;
        this._emptyDirs = opts.emptyDirs;
        this._dest = path.resolve(dest);

        this._map = new Map();
    }
    /**
     * Adds directory (without its files and subdirs) to artifact.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} dir — the directory info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    // eslint-disable-next-line class-methods-use-this
    addDirectory(dir, callback) { // eslint-disable-line no-unused-vars
        throw new Error('The `addDirectory` method is not implemented.');
    }
    /**
     * Adds file to artifact.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} file — the file info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    // eslint-disable-next-line class-methods-use-this
    addFile(file, callback) { // eslint-disable-line no-unused-vars
        throw new Error('The `addFile` method is not implemented.');
    }
    /**
     * Adds symlink to artifact.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} file — the file info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    // eslint-disable-next-line class-methods-use-this
    addSymbolicLink(file, callback) { // eslint-disable-line no-unused-vars
        throw new Error('The `addSymbolicLink` method is not implemented.');
    }
    /**
     * Adds file or directory to artifact.
     *
     * @param {{path: string, base: string, cwd: string, history: string[]}} chunk — the file to be added in artifact.
     * @param {string} encoding — ignore the encoding argument, need only for stream in non-object mode.
     * @param {object} callback — call this function when processing is complete for the supplied chunk.
     * @returns {undefined}
     */
    _write(chunk, encoding, callback) {
        const filename = chunk.history[0];
        const relative = path.relative(chunk.cwd, chunk.path);

        // ignore root dir
        if (relative === '') {
            return callback();
        }

        fs.lstat(filename, (err, lstats) => {
            if (err) {
                return callback(err);
            }

            const mtimeMs = this._map.get(filename);
            if (mtimeMs && mtimeMs === lstats.mtimeMs) {
                return callback();
            } else {
                this._map.set(filename, lstats.mtimeMs);
            }

            // logs only for testing; will be removed before the merge
            console.log(`Add file ${chunk.history[0]} in ${this._dest} because it is time to do this`)

            const file = Object.assign({ relative, stats: lstats }, chunk);

            const addDirectory = (dirInfo) => {
                // ignore empty dir
                if (!this._emptyDirs) {
                    return callback();
                }

                return this.addDirectory(dirInfo, callback);
            };
            const addFile = (fileInfo) => {
                // ignore empty file
                if (!this._emptyFiles && lstats.size === 0) {
                    return callback();
                }

                this.addFile(fileInfo, callback);
            };

            if (lstats.isSymbolicLink()) {
                if (this._followSymlinks) {
                    return fs.stat(file.history[0], (error, stats) => {
                        if (error) {
                            return callback(error);
                        }

                        const targetFile = Object.assign({}, file, { stats });

                        if (stats.isDirectory()) {
                            addDirectory(targetFile);
                        } else {
                            addFile(targetFile);
                        }
                    });
                }

                return this.addSymbolicLink(file, callback);
            }

            if (lstats.isDirectory()) {
                return addDirectory(file);
            }

            addFile(file);
        });
    }
};
