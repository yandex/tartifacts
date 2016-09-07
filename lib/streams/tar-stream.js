'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');

const archiver = require('archiver');

/**
 * Returns `true` if object contains path to directory.
 *
 * **Important:** if pattern contains path to directory without last slash (path/to/dir), then returns `false`.
 *
 * @param {{path: string, base: string, cwd: string}} file — The glob stream object with file info.
 *
 * @returns {Boolean}
 */
function isDirectory(file) {
    const filename = file.path;

    return filename.endsWith('/') || filename.includes('/') && file.base === `${filename}/`;
}

module.exports = class TarStream extends stream.Writable {
    constructor(dest, options) {
        const defaults = {
            emptyFiles: true,
            emptyDirs: true,
            gzip: false
        };
        const opts = Object.assign(defaults, options);

        super({ objectMode: true });

        try {
            const output = fs.createWriteStream(dest);
            const archive = archiver('tar', {
                gzip: opts.gzip,
                gzipOptions: typeof gzip === 'object' ? opts.gzip : { level: 1 }
            });

            archive.pipe(output);

            archive.on('error', err => this.emit('error', err));

            output.once('open', () => this.emit('open'));
            output.once('close', () => this.emit('close'));

            this._archive = archive;
            this._emptyFiles = opts.emptyFiles;
            this._emptyDirs = opts.emptyDirs;

            this.once('finish', () => archive.finalize());
        } catch (err) {
            this.emit('error', err);
        }
    }
    _write(file, encoding, callback) {
        const filename = file.path;
        const relative = path.relative(file.cwd, filename);

        if (isDirectory(file)) {
            this._emptyDirs && this._archive.append('', {
                name: relative,
                type: 'directory'
            });

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

            if (!this._emptyFiles && stats.size === 0) {
                return callback();
            }

            if (stats.isDirectory()) {
                this._emptyDirs && this._archive.append('', {
                    name: relative,
                    type: 'directory'
                });

                return callback();
            }

            this._archive.append(fs.createReadStream(filename), {
                name: relative,
                type: 'file',
                _stats: stats,
                size: stats.size
            });

            callback();
        });
    }
};
