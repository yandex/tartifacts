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
        chunk.history = [chunk.path];

        try {
            if (this.transform) {
                chunk = this.transform(chunk);
            }

            const chunks = Array.isArray(chunk) ? chunk : [chunk];

            chunks.forEach((c) => c && this.push(c));

            callback();
        } catch (e) {
            callback(e);
        }
    }
};
