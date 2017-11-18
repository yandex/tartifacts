'use strict';

const parsePatterns = require('../parse-patterns');

/**
 * Loades patterns from CommonJS module file.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {Promise<{ includes: string[], excludes: [] }>}
 */
module.exports = (filename) => {
    return new Promise((resolve, reject) => {
        try {
            const patternModule = require(filename);
            const sourcePatterns = typeof patternModule === 'function' ? patternModule() : patternModule;
            const patterns = parsePatterns(sourcePatterns);

            resolve(patterns);
        } catch (err) {
            reject(err);
        }
    });
};
