'use strict';

/**
 * Returns `true` if pattern is negative.
 *
 * @param {string} pattern — the glob pattern.
 *
 * @returns {boolean}
 */
module.exports = (pattern) => pattern.charAt(0) === '!';
