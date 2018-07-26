'use strict';

const path = require('path');
const fs = require('graceful-fs');
const makeDir = require('make-dir');
const proxyquire = require('proxyquire');
const GlobStream = proxyquire('glob-stream', {
    'glob': proxyquire('glob', { 'fs': fs })
});

const { TarStream, CopyStream, TransformStream } = require('../streams');

module.exports = class StaticArtifact {
    static create(options) {
        return new this(options);
    }

    constructor(options) {
        this._options = options;
    }

    write() {
        return makeDir(this._destDir, { fs })
            .then(() => this._write());
    }

    _write() {
        return new Promise((resolve, reject) => {
            const readStream = this._createReadStream();
            const transformStream = this._createTransformStream();
            const writeStream = this._createWriteStream();

            readStream.on('error', reject);
            transformStream.on('error', reject);
            writeStream.on('error', reject).on('close', resolve);

            readStream.pipe(transformStream).pipe(writeStream);
        });
    }

    get _destDir() {
        return this._options.tar ? path.dirname(this._options.path) : this._options.path;
    }

    _createReadStream() {
        const readStreamOptions = {
            cwd: this._options.root,
            dot: this._options.dotFiles,
            nodir: !this._options.emptyDirs,
            follow: this._options.followSymlinks,
            nosort: true
        };

        return new GlobStream(this._options.patterns, readStreamOptions);
    }

    _createWriteStream() {
        const writeStreamOptions = {
            emptyFiles: this._options.emptyFiles,
            emptyDirs: this._options.emptyDirs,
            followSymlinks: this._options.followSymlinks
        };
        const gzipOptions = {gzip: this._options.gzip, gzipOptions: this._options.gzipOptions};

        return this._options.tar
            ? new TarStream(this._options.path, Object.assign({}, writeStreamOptions, gzipOptions))
            : new CopyStream(this._options.path, writeStreamOptions);
    }

    _createTransformStream() {
        return new TransformStream(this._options.transform);
    }

    close() {} // eslint-disable-line class-methods-use-this
};
