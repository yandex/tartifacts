'use strict';

const assert = require('assert');
const _ = require('lodash');
const isNegativePattern = require('./is-negative-pattern');

/**
 * Composes glob patterns.
 *
 * In `patterns` field will be added includes and excludes patterns.
 *
 * The excludes patterns will be converted to negative patterns.
 *
 * @param {string|string[]|object} config            The glob patterns to files which need to be included or excluded.
 * @param {Object}                 [actions]
 * @param {string[]}               [actions.include] The glob patterns to files which need to be included.
 * @param {string[]}               [actions.exclude] The glob patterns to files which need to be excluded.
 * @returns {object}
 */
module.exports = (config = [], actions = {}) => {
    assert(!_.isEmpty(config) || !_.isEmpty(actions.include), 'you should specify the includes or patterns parameters for artifact.');

    const includes = [].concat(actions.include || []);
    const excludes = [].concat(actions.exclude || []).map(pattern => {
        return isNegativePattern(pattern) ? pattern : `!${pattern}`
    });

    if (includes.some(isNegativePattern)) {
        throw new Error('the includes parameter of artifact should not contains negative patterns.');
    }

    if (!_.isPlainObject(config)) {
        config = { '.': [].concat(config) };
    }

    const normalizedConfig = _.mapValues(config, (patterns) => [].concat(patterns, includes, excludes));

    _.forEach(normalizedConfig, (patterns) => {
        if (isNegativePattern(patterns[0])) {
            throw new Error('the first pattern of artifact should not be negative.');
        }
    });

    return normalizedConfig;
};
