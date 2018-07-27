'use strict';

const StaticArtifact = require('./static-artifact');
const promiseUtils = require('../promise-utils');

module.exports = class DelayedArtifact extends StaticArtifact {
    constructor(options) {
        super(options);

        this._defer = promiseUtils.defer();
    }

    _write() {
        return new Promise((resolve, reject) => {
            const writeStream = this._createWriteStream();

            writeStream.on('error', reject).on('close', resolve);

            this._pipeStream(writeStream, { end: false }, reject);

            return this._awaitUntilClosed()
                .then(() =>  this._pipeStream(writeStream, { end: true }, reject));
        });
    }

    _pipeStream(writeStream, options, reject) {
        const readStream = this._createReadStream();
        const transformStream = this._createTransformStream();

        readStream.on('error', reject);
        transformStream.on('error', reject);

        readStream.pipe(transformStream).pipe(writeStream, options);
    }

    _awaitUntilClosed() {
        this._defer.id = setInterval(() => {}, 0);

        return this._defer.promise;
    }

    close() {
        clearInterval(this._defer.id);

        this._defer.resolve();
    }
};
