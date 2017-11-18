'use strict';

const fs = require('fs');

const promisify = require('es6-promisify');

const parsePatterns = require('../parse-patterns');
const readFile = promisify(fs.readFile);

/**
 * Loades patterns from text file.
 *
 * @param {string} filename - the path to file with patterns.
 * @returns {Promise<{ includes: string[], excludes: [] }>}
 */
module.exports = (filename) => readFile(filename, 'utf-8').then(parsePatterns);
