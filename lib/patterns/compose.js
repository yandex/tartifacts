'use strict';

const assert = require('assert');

const isNegativePattern = require('./is-negative-pattern');

/**
 * Composes glob patterns.
 *
 * In `patterns` field will be added includes and excludes patterns.
 *
 * The excludes patterns will be converted to negative patterns.
 *
 * @param {string[]} patterns The glob patterns to files which need to be included or excluded.
 * @param {Object}   [actions]
 * @param {string[]} [actions.include] The glob patterns to files which need to be included.
 * @param {string[]} [actions.exclude] The glob patterns to files which need to be excluded.
 * @returns {string[]}
 */
module.exports = (patterns, actions) => {
    const obj = actions || {};

    assert(patterns || obj.include, 'you should specify the includes or patterns parameters for artifact.');

    const includes = [].concat(obj.include || []);
    const excludes = [].concat(obj.exclude || []).map(pattern => {
        return isNegativePattern(pattern) ? pattern : `!${pattern}`
    });

    if (includes.some(isNegativePattern)) {
        throw new Error('the includes parameter of artifact should not contains negative patterns.');
    }

    const normalizedPatterns = [].concat(patterns || [], includes, excludes);
    const firstPattern = normalizedPatterns[0];

    if (isNegativePattern(firstPattern)) {
        throw new Error('the first pattern of artifact should not be is negative.');
    }

    return normalizedPatterns;
};
