'use strict';

const path = require('path');
const StaticArtifact = require('./static-artifact');
const { FilterStream } = require('../streams');

module.exports = class RuntimeArtifact extends StaticArtifact {
    constructor(options) {
        super(options);

        this._map = new Map();
        this._closed = false;
    }

    _write() {
        return new Promise((resolve, reject) => {
            this._writeStream = this._createWriteStream();

            this._writeStream.on('error', reject).on('close', resolve);

            return this._watchFS();
        });
    }

    _watchFS() {
        return this._closed
            ? this._scanFS({ end: true })
            : this._scanFS({ end: false }).then(() => this._watchFS());
    }

    _scanFS(options) {
        return new Promise((resolve, reject) => {
            const readStream = this._readStream = this._createReadStream();
            const statStream = this._statStream = this._createStatStream();
            const filterStream = this._filterStream = this._createFilterStream();
            const transformStream = this._transformStream = this._createTransformStream();

            readStream.on('error', reject);
            statStream.on('error', reject);
            filterStream.on('error', reject);
            transformStream.on('error', reject).on('end', resolve);

            readStream.pipe(statStream).pipe(filterStream).pipe(transformStream).pipe(this._writeStream, options);
        });
    }

    _createFilterStream() {
        return new FilterStream((chunk) => {
            const relative = path.join(chunk.subdir, path.relative(chunk.cwd, chunk.path));
            const mtimeMs = this._map.get(relative);

            if (!mtimeMs || mtimeMs < chunk.lstats.mtimeMs) {
                this._map.set(relative, chunk.lstats.mtimeMs);
                return true;
            }

            return false;
        });
    }

    close() {
        this._readStream.destroy();

        this._closed = true;
    }
};
