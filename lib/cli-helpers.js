'use strict';
const path = require('path');
const patterns = require('../lib/patterns');

/**
 * Returns info about artifacts.
 *
 * @param {object} options
 * @param {string} options.dest
 * @param {string|string[]} options.patterns
 * @param {string[]} options.includes
 * @param {string[]} options.excludes
 * @param {boolean} options.tar
 * @param {boolean} options.gzip
 * @returns {object[]} The artifacts info.
 */
const getArtifactsInfoList = (options) => {
    if (options.config) {
        return require(path.resolve(options.config));
    }

    const basename = path.basename(options.dest);

    return [{
        dest: options.dest,
        patterns: options.patterns && patterns.load(options.patterns),
        includes: [].concat(options.include || []),
        excludes: [].concat(options.exclude || []),
        tar: basename.includes('.tar'),
        gzip: basename.includes('.gz')
    }];
};

module.exports = {
    getArtifactsInfoList
};