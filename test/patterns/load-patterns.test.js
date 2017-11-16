'use strict';

const test = require('ava');
const mockFs = require('mock-fs');

const loadPatterns = require('../../lib/patterns').load;

test.afterEach(() => mockFs.restore());

test('should load text patterns', t => {
    mockFs({
        'patterns': [
            '# include lib',
            'lib/**',
            '',
            '# exclude test files',
            '!lib/**/*.test.js'
        ].join('\n')
    });

    const patterns = loadPatterns('./patterns');

    t.deepEqual(patterns, ['lib/**', '!lib/**/*.test.js']);
});

test.failing('should load json patterns', t => {
    mockFs({
        'patterns.json': [
            '["lib/**", "!lib/**/*.test.js"]',
        ].join('\n')
    });

    const patterns = loadPatterns('./patterns.json');

    t.deepEqual(patterns, ['lib/**', '!lib/**/*.test.js']);
});

test.failing('should load pattern module', t => {
    mockFs({
        'patterns.js': [
            'module.exports = ["lib/**", "!lib/**/*.test.js"];',
        ].join('\n')
    });

    const patterns = loadPatterns('./patterns.js');

    t.deepEqual(patterns, ['lib/**', '!lib/**/*.test.js']);
});

test.failing('should load function', t => {
    mockFs({
        'patterns.js': [
            'module.exports = () => ["lib/**", "!lib/**/*.test.js"];',
        ].join('\n')
    });

    const patterns = loadPatterns('./patterns.js');

    t.deepEqual(patterns, ['lib/**', '!lib/**/*.test.js']);
});
