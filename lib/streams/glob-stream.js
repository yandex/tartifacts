'use strict';

const stream = require('stream');
const _ = require('lodash');
const fs = require('graceful-fs');
const proxyquire = require('proxyquire');
// const gs = proxyquire('glob-stream', {
//     'glob': proxyquire('glob', { 'fs': fs })
// });
const fg = require('fast-glob');

module.exports = class GlobStream extends stream.Readable {
    constructor(config, options) {
        super({ objectMode: true });

        this._readables = new Set();

        _.forEach(config, (patterns, subdir) => {
            const readable = fg.stream(patterns, options);
            this._readables.add(readable);

            readable.on('data', (path) => this.push({ subdir, cwd: options.cwd, path}));
            readable.on('error', (error) => this.emit('error', error));
            readable.on('end', () => {
                this._readables.delete(readable);
                if (this._readables.size === 0) {
                    this.push(null);
                }
            });
        });
    }

    _destroy() {
        this._readables.forEach((readable) => readable.destroy());
    }

    _read() {} // eslint-disable-line class-methods-use-this
};
