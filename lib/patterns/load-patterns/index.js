'use strict';

const path = require('path');

const loadJsPatterns = require('./load-js-patterns');
const loadTextPatterns = require('./load-text-patterns');

/**
 * Loades patterns from file.
 *
 * Supports CommonJs modules and text files.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {Promise<{ includes: string[], excludes: [] }>}
 */
module.exports = (filename) => {
    const patternFilename = path.resolve(filename);
    const ext = path.extname(patternFilename);

    if (ext === '.js') {
        return loadJsPatterns(patternFilename);
    }

    return loadTextPatterns(patternFilename);
};
