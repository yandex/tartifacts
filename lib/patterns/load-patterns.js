'use strict';

const fs = require('fs');
const path = require('path');

const parsePatterns = require('./parse-patterns');

/**
 * Loades file with patterns.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {{ includes: string[], excludes: [] }}
 */
module.exports = (filename) => {
    const patternFilename = path.resolve(filename);
    const ext = path.extname(patternFilename);

    if (ext === '.js') {
        const patternModule = require(patternFilename);
        const patterns = typeof patternModule === 'function' ? patternModule() : patternModule;

        return parsePatterns(patterns);
    }

    const patterns = fs.readFileSync(patternFilename, 'utf-8');

	return parsePatterns(patterns);
};
