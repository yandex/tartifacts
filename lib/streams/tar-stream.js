'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');

const archiver = require('archiver');

module.exports = class TarStream extends stream.Writable {
    constructor(dest, options) {
        const defaults = {
            emptyFiles: true,
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

            this.once('finish', () => archive.finalize());
        } catch (err) {
            this.emit('error', err);
        }
    }
    _write(file, encoding, callback) {
        const filename = file.path;

        fs.stat(filename, (err, stats) => {
            if (err) {
                return fs.lstat(filename, lerr => {
                    // file not found
                    if (lerr) { return callback(err); }

                    // ignore broken symlink
                    callback();
                });
            }

            if (stats.isDirectory() || !this._emptyFiles && stats.size === 0) {
                return callback();
            }

            const relative = path.relative(file.base, filename);

            this._archive.append(fs.createReadStream(filename), {
                name: relative,
                mode: stats.mode,
                date: stats.mtime
            });

            callback();
        });
    }
};
