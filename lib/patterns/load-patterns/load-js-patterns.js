'use strict';

const fileEval = require('node-file-eval');

const parsePatterns = require('../parse-patterns');

/**
 * Loades patterns from CommonJS module file.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {Promise<{ includes: string[], excludes: [] }>}
 */
module.exports = (filename) => {
    return fileEval(filename)
        .then(patternModule => {
            const sourcePatterns = typeof patternModule === 'function' ? patternModule() : patternModule;

            return parsePatterns(sourcePatterns);
        });
};
