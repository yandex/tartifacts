'use strict';

const path = require('path');
const globParent = require('glob-parent');
const fs = require('graceful-fs');
const _ = require('lodash');
const makeDir = require('make-dir');
const { isNegativePattern } = require('../patterns');

const { CopyStream, GlobStream, TarStream, TransformStream } = require('../streams');

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
            const statStream = this._createStatStream();
            const transformStream = this._createTransformStream();
            const writeStream = this._createWriteStream();

            readStream.on('error', reject);
            transformStream.on('error', reject);
            writeStream.on('error', reject).on('close', resolve);

            readStream.pipe(statStream).pipe(transformStream).pipe(writeStream);
        });
    }

    get _destDir() {
        return this._options.tar ? path.dirname(this._options.path) : this._options.path;
    }

    _createReadStream(dirs) {
        const readStreamOptions = {
            cwd: this._options.root,
            dot: this._options.dotFiles,
            nodir: false,//!this._options.emptyDirs,
            follow: this._options.followSymlinks,
            nosort: true
        };

        const patterns = _.pickBy(_.mapValues(this._options.patterns, (patterns) => {
            return patterns.filter((pattern) => {
                const parent = globParent(pattern);
                const atimeMs = this._dirs.get(parent);
                if (!atimeMs) {
                    return true;
                }

                const stats = fs.statSync(parent);

                return stats.atimeMs > atimeMs;
            });
        }), (i) => !_.isEmpty(i));

        if (!_.isEmpty(patterns)) {
            console.log(patterns);
        }

        return new GlobStream(patterns, readStreamOptions);
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

    _createTransformStream(transform = this._options.transform) {
        return new TransformStream(transform);
    }

    _createStatStream() {
        return this._createTransformStream((chunk) => {
            return new Promise((resolve, reject) => {
                fs.lstat(chunk.path, (err, lstats) => {
                    if (err) {
                        return reject(err);
                    }

                    chunk.lstats = lstats;

                    resolve(chunk);
                });
            });
        });
    }

    close() {} // eslint-disable-line class-methods-use-this
};
