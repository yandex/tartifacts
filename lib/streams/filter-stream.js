'use strict';

const stream = require('stream');

module.exports = class FilterStream extends stream.Transform {
    constructor(filterFn) {
        super({ objectMode: true });

        this._filterFn = filterFn;
    }

    _transform(chunk, encoding, callback) {
        try {
            if (this._filterFn(chunk)) {
                this.push(chunk);
            }

            callback();
        } catch (e) {
            callback(e);
        }
    }
};
