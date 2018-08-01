'use strict';

const test = require('ava');

const composePatterns = require('../../../lib/patterns').compose;

test('should merge includes with source patterns', t => {
    const patterns = composePatterns({
        './subdir1': ['source-dir/**'],
        './subdir2': ['source-dir/**']
    }, { include: ['sources/exlib/**'] });

    t.deepEqual(patterns, {
        './subdir1': ['source-dir/**', 'sources/exlib/**'],
        './subdir2': ['source-dir/**', 'sources/exlib/**']
    });
});

test('should merge excludes with patterns', t => {
    const patterns = composePatterns({
        './subdir1': ['source-dir/**'],
        './subdir2': ['source-dir/**']
    }, { exclude: ['sources/exlib/**'] });

    t.deepEqual(patterns, {
        './subdir1': ['source-dir/**', '!sources/exlib/**'],
        './subdir2': ['source-dir/**', '!sources/exlib/**']
    });
});

test('should support negative patterns', t => {
    const patterns = composePatterns({
        './subdir1': ['source-dir/**', '!sources/exlib/**'],
        './subdir2': ['source-dir/**', '!sources/exlib/**']
    });

    t.deepEqual(patterns, {
        './subdir1': ['source-dir/**', '!sources/exlib/**'],
        './subdir2': ['source-dir/**', '!sources/exlib/**']
    });
});

test('should support includes as string', async t => {
    const patterns = composePatterns({
        './subdir1': [],
        './subdir2': []
    }, { include: 'source-dir/**' });

    t.deepEqual(patterns, { './subdir1': ['source-dir/**'], './subdir2': ['source-dir/**'] });
});

test('should support excludes as string', async t => {
    const patterns = composePatterns({
        './subdir1': ['source-dir/**'],
        './subdir2': ['source-dir/**']
    }, { exclude: 'source-dir/file-2.txt' });

    t.deepEqual(patterns, {
        './subdir1': ['source-dir/**', '!source-dir/file-2.txt'],
        './subdir2': ['source-dir/**', '!source-dir/file-2.txt']
    });
});

test('should support excludes with negative patterns', async t => {
    const patterns = composePatterns({
        './subdir1': ['source-dir/**'],
        './subdir2': ['source-dir/**']
    }, { exclude: '!source-dir/file-2.txt' });

    t.deepEqual(patterns, {
        './subdir1': ['source-dir/**', '!source-dir/file-2.txt'],
        './subdir2': ['source-dir/**', '!source-dir/file-2.txt']
    });
});
