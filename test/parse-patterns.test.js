'use strict';

const test = require('ava');

const parsePatterns = require('../lib/parse-patterns');

test('should parse includes', t => {
    const patterns = [
        'dir/**'
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['dir/**']);
});

test('should parse excludes', t => {
    const patterns = [
        '!dir/**'
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['!dir/**']);
});

test('should ignore comments', t => {
    const patterns = [
        '# commnet',
        'dir/**'
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['dir/**']);
});

test('should ignore line comments', t => {
    const patterns = [
        'dir/** # commnet'
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['dir/**']);
});

test('should skip empty lines', t => {
    const patterns = [
        'dir-1/**',
        '   ',
        'dir-2/**'
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['dir-1/**', 'dir-2/**']);
});

test('should ignore whitespaces', t => {
    const patterns = [
        '   dir-1/**',
        'dir-2/**   ',
        '  dir-3/** '
    ].join('\n');

    t.deepEqual(parsePatterns(patterns), ['dir-1/**', 'dir-2/**', 'dir-3/**']);
});

test('should support window EOL', t => {
    const patterns = [
        'dir-1/**',
        'dir-2/** '
    ].join('\r\n');

    t.deepEqual(parsePatterns(patterns), ['dir-1/**', 'dir-2/**']);
});

test('should support array', t => {
    const patterns = [
        'dir-1/**'
    ];

    t.deepEqual(parsePatterns(patterns), ['dir-1/**']);
});
