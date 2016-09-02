'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Parses patterns format.
 *
 * @param {string|string[]} str - pattern lines
 * @returns {{ includes: string[], excludes: string[] }}
 */
const parsePatterns = exports.parse = (str) => {
    const lines = Array.isArray(str) ? str : str.split(/\r?\n/);
    const patterns = [];

    lines.forEach(line => {
        const hashIndex = line.indexOf('#');
        const pattern = hashIndex !== -1 ? line.substr(0, hashIndex) : line;
        const clearPattern = pattern.trim();

        if (clearPattern !== '') {
            patterns.push(clearPattern);
        }
	});

    return patterns;
};


/**
 * Loades file with patterns.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {{ includes: string[], excludes: [] }}
 */
exports.load = function(filename) {
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
