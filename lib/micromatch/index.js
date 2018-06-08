'use strict';

const micromatch = require('micromatch');
const _ = require('lodash');

/**
 * @param {object} options
 * @returns {function}
 */
exports.bindOptions = (options) => {
    const decorated = decorate(micromatch, micromatch, options);

    Object.keys(micromatch).forEach((item) => {
        if (typeof micromatch[item] === 'function') {
            decorated[item] = decorate(micromatch[item], micromatch, options);
        }
    });

    return decorated;
};

/**
 * @param {function} baseFn
 * @param {object} ctx
 * @param {object} options
 * @returns {function}
 */
function decorate(baseFn, ctx, options) {
    return function() {
        const args = Array.prototype.slice.call(arguments);
        const lastArg = args[args.length - 1];

        if (args.length > 1 && _.isPlainObject(lastArg)) {
            args[args.length - 1] = Object.assign({}, lastArg, options);
        } else {
            args.push(options);
        }

        return baseFn.apply(ctx, args);
    }
}
