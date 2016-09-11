'use strict';

const path = require('path');
const stream = require('stream');

const fs = require('graceful-fs');

/**
 * Returns `true` if object contains path to directory.
 *
 * **Important:** if pattern contains path to directory without last slash (path/to/dir), then returns `false`.
 *
 * @param {{path: string, base: string, cwd: string}} file — the file info.
 *
 * @returns {Boolean}
 */
function isDirectoryName(file) {
    const filename = file.path;

    return filename.endsWith('/') || filename.includes('/') && file.base === `${filename}/`;
}

/**
 * Abstract artifact stream.
 *
 * @extends stream.Writable
 */
module.exports = class ArtifactStream extends stream.Writable {
    /**
     * Create artifact stream.
     *
     * @param {string}  dest               The path to destination file or directory.
     * @param {object}  options            The options.
     * @param {boolean} options.emptyFiles Include empty files.
     * @param {boolean} options.emptyDirs  Include empty directories.
     */
    constructor(dest, options) {
        const defaults = { emptyFiles: true, emptyDirs: true };
        const opts = Object.assign(defaults, options);

        super({ objectMode: true });

        this._emptyFiles = opts.emptyFiles;
        this._emptyDirs = opts.emptyDirs;
        this._dest = path.resolve(dest);
    }
    /**
     * Adds directory (without its files and subdirs) to artifact.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} dir — the directory info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    addDirectory(dir, callback) { // eslint-disable-line no-unused-vars
        throw new Error('The `addDirectory` method is not implemented.');
    }
    /**
     * Adds file to artifact.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} file — the file info.
     * @param {function} callback — call this function when processing is complete.
     * @abstract
     */
    addFile(file, callback) { // eslint-disable-line no-unused-vars
        throw new Error('The `addFile` method is not implemented.');
    }
    /**
     * Adds file or directory to artifact.
     *
     * @param {{path: string, base: string, cwd: string}} chunk — the file to be added in artifact.
     * @param {string} encoding — ignore the encoding argument, need only for stream in non-object mode.
     * @param {object} callback — call this function when processing is complete for the supplied chunk.
     * @returns {undefined}
     */
    _write(chunk, encoding, callback) {
        const filename = chunk.path;
        const relative = path.relative(chunk.cwd, filename);

        // ignore root dir
        if (relative === '') {
            return callback();
        }

        // ignore empty dir by path
        if (!this._emptyDirs && isDirectoryName(chunk)) {
            return callback();
        }

        fs.stat(filename, (err, stats) => {
            if (err) {
                return fs.lstat(filename, lerr => {
                    // file not found
                    if (lerr) { return callback(err); }

                    // ignore broken symlink
                    callback();
                });
            }

            const file = Object.assign({ relative, stats }, chunk);

            if (stats.isDirectory()) {
                // ignore empty dir
                if (!this._emptyDirs) {
                    return callback();
                }

                return this.addDirectory(file, callback);
            }

            // ignore empty file
            if (!this._emptyFiles && stats.size === 0) {
                return callback();
            }

            this.addFile(file, callback);
        });
    }
};
