'use strict';

const stream = require('stream');

/**
 * Limited Stream.
 *
 * Transform stream which can be used to limit the amount of bytes which pass from a readable stream to a writable stream.
 * This functionality can be necessary when a readable stream is being changed in a runtime, but a writable stream expects fixed amount of bytes.
 *
 * @extends stream.Transform
 */
module.exports = class LimitedStream extends stream.Transform {
    constructor(size) {
        super();

        this._size = size;
    }

    _transform(chunk, encoding, callback) {
        if (this._size < chunk.length) {
            chunk = chunk.slice(0, this._size);
        }

        this.push(chunk);
        this._size -= chunk.length;
        callback();
    }
};
