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
        const relative = path.relative(file.base, filename);

        // try to read file
        const readable = fs.createReadStream(filename)
            .once('readable', () => {
                const state = readable._readableState;
                const isEmpty = state.length === 0;

                if (!this._emptyFiles && isEmpty) {
                    return callback();
                }

                this._archive.append(readable, {
                    name: relative,
                    type: 'file'
                });

                callback();
            })
            .once('error', (err) => {
                // try to read directory
                if (err.code === 'EBADF' && err.errno === 9) {
                    this._archive.append('', {
                        name: relative,
                        type: 'directory'
                    });

                    return callback();
                }

                // maybe it's broken symlink
                fs.lstat(filename, lerr => {
                    // file not found
                    if (lerr) { return callback(err); }

                    // ignore broken symlink
                    callback();
                });
            });
    }
};
