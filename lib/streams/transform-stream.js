'use strict';

const stream = require('stream');

/**
 * Transform stream.
 *
 * @extends stream.Transform
 */
module.exports = class TransformStream extends stream.Transform {
    /**
     *
     * @param {Function} [transform]
     */
    constructor(transform) {
        super({ objectMode: true });

        this.transform = transform;
    }

    /**
     * @param {{path: string, relative: string, base: string, cwd: string}} chunk — the file to be transformed.
     * @param {string} encoding — ignore the encoding argument, need only for stream in non-object mode.
     * @param {object} callback — call this function when processing is complete for the supplied chunk.
     * @returns {undefined}
     */
    _transform(chunk, encoding, callback) {
        if (chunk.history) {
            chunk.history.push(chunk.path);
        } else {
            chunk.history = [chunk.path];
        }

        Promise.resolve()
            .then(() => this.transform ? this.transform(chunk) : chunk)
            .then((transformed) => {
                const chunks = Array.isArray(transformed) ? transformed : [transformed];

                chunks.forEach((c) => c && this.push(c));

                callback();
            })
            .catch(callback);
    }
};
