'use strict';

const assert = require('assert');

/**
 * Returns `true` if pattern is negative.
 *
 * @param {string} pattern — the pattern with to files which need to be included or excluded.
 *
 * @returns {Boolean}
 */
function isNegativePattern(pattern) {
    return pattern.charAt(0) === '!';
}

/**
 * Normalizes artifact object.
 *
 * In `patterns` field will be added includes and excludes patterns.
 *
 * The excludes patterns will be converted to negative patterns.
 *
 * @param {object}   artifact             The artifact info.
 * @param {string[]} [artifact.patterns]  The paths to files which need to be included or excluded.
 * @param {string[]} [artifact.includes]  The paths to files which need to be included.
 * @param {string[]} [artifact.excludes]  The paths to files which need to be excluded.
 * @returns {{ patterns: string }}
 */
module.exports = function (artifact) {
    assert(artifact && artifact.dest, 'You should specify the dest for artifact.');
    assert(artifact.includes || artifact.patterns,
        'You should specify the includes or patterns parameters for artifact.');

    const patterns = [].concat(artifact.patterns || []);
    const includes = [].concat(artifact.includes || []);
    const excludes = [].concat(artifact.excludes || []).map(pattern => {
        return isNegativePattern(pattern) ? pattern : `!${pattern}`
    });

    if (includes.some(isNegativePattern)) {
        throw new Error('The includes parameter of artifact should not contains negative patterns.');
    }

    const normalizedPatterns = [].concat(patterns, includes, excludes);
    const firstPattern = normalizedPatterns[0];

    if (isNegativePattern(firstPattern)) {
        throw new Error('The first pattern of artifact should not be is negative.');
    }

    return Object.assign({}, artifact, {
        patterns: normalizedPatterns
    });
};
