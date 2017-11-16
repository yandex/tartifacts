'use strict';

/**
 * Parses patterns.
 *
 * @param {string|string[]} str - pattern lines
 * @returns {{ includes: string[], excludes: string[] }}
 */
module.exports = (str) => {
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
