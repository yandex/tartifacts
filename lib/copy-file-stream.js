'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');

const copy = require('copy');

module.exports = class CopyFileStream extends stream.Writable {
    constructor(dest, options) {
        options || (options = {});

        super({ objectMode: true });

        this._emptyFiles = options.emptyFiles;
        this._dest = path.resolve(dest);
    }
    _write(file, encoding, callback) {
        const filename = file.path;

        fs.stat(filename, (err, stats) => {
            if (err) {
                return this.emit('error', err);
            }

            if (stats.isDirectory() || !this._emptyFiles && stats.size === 0) {
                return callback();
            }

            copy.one(filename, this._dest, { srcBase: file.cwd }, callback);
        });
    }
};
