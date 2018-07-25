'use strict';

const promiseUtils = require('../promise-utils');
const StaticArtifact = require('./static-artifact');

/**
 * Delayed artifact.
 *
 * Creates an artifact in two steps:
 * 1. reads filepaths on a file system according to given masks and add them to an artifact
 *    if their mtime is less than start time of artifact creation;
 * 2. reads filepaths on a file system according to given masks and add them to an artifact
 *    if their mtime is greater than start time of arifact creation
 */
module.exports = class DelayedArtifact extends StaticArtifact {
    constructor(options) {
        super(options);

        this._closed = false;
        this._startTime = options.watch.startTime || Date.now();
    }

    _write() {
        return new Promise((resolve, reject) => {
            const readStream = this._createReadStream();
            const transformStream = this._createTransformStream();
            const writeStream = this._createWriteStream();

            readStream.on('error', reject);
            transformStream.on('error', reject);
            writeStream.on('error', reject).on('close', resolve);

            writeStream.setFilter((filename, { mtimeMs }) => mtimeMs < this._startTime);

            readStream.pipe(transformStream).pipe(writeStream, { end: false });

            return this._awaitUntilClosed()
                .then(() => readStream.unpipe(transformStream) && transformStream.unpipe(writeStream))
                .then(() => {
                    const delayedReadStream = this._createReadStream();
                    const delayedTransformStream = this._createTransformStream();

                    delayedReadStream.on('error', reject);
                    delayedTransformStream.on('error', reject);

                    writeStream.setFilter((filename, { mtimeMs }) => !writeStream.isWritten(filename) || mtimeMs > this._startTime);

                    delayedReadStream.pipe(delayedTransformStream).pipe(writeStream);
                });
        });
    }

    _awaitUntilClosed() {
        return this._closed ? Promise.resolve() : new Promise((resolve) => setTimeout(() => this._awaitUntilClosed().then(resolve), 0));
    }

    close() {
        this._closed = true;
    }
};
