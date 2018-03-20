'use strict';

const stream = require('stream');

const Vinyl = require('vinyl');

/**
 * Vinyl converter Transform stream.
 *
 * Stream convert chunk to vinyl-object.
 *
 * Chunk should has a "path" property.
 *
 * @extends stream.Transform
 */
module.exports = class VinylConvertStream extends stream.Transform {
    /**
     * Create vinyl-convert Transform stream.
     */
    constructor() {
        super({ objectMode: true });
    }

    /**
     * Convert chunk to vinyl-object.
     *
     * @param {Vinyl} chunk — the file to be converted.
     * @param {string} encoding — ignore the encoding argument, need only for stream in non-object mode.
     * @param {object} callback — call this function when processing is complete for the supplied chunk.
     * @returns {undefined}
     */
    _transform(chunk, encoding, callback) {
        const file = new Vinyl(chunk);

        this.push(file);

        callback();
    }
};
