'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');

const mkdirp = require('mkdirp');
const copy = require('copy');

module.exports = class CopyStream extends stream.Writable {
    constructor(dest, options) {
        const defaults = { emptyFiles: true };
        const opts = Object.assign(defaults, options);

        super({ objectMode: true });

        this._emptyFiles = opts.emptyFiles;
        this._dest = path.resolve(dest);
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

            if (!this._emptyFiles && stats.size === 0) {
                return callback();
            }

            if (stats.isDirectory()) {
                const dirname = path.join(this._dest, path.relative(file.cwd, filename));

                mkdirp(dirname, callback);
            } else {
                copy.one(filename, this._dest, { srcBase: file.cwd }, callback);
            }
        });
    }
};
