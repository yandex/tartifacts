'use strict';

const test = require('ava');

const composePatterns = require('../../../lib/patterns').compose;

test('should merge includes with source patterns', t => {
    const patterns = composePatterns(['source-dir/**'], { include: ['sources/exlib/**'] });

    t.deepEqual(patterns, ['source-dir/**', 'sources/exlib/**']);
});

test('should merge excludes with patterns', t => {
    const patterns = composePatterns(['source-dir/**'], { exclude: ['sources/exlib/**'] });

    t.deepEqual(patterns, ['source-dir/**', '!sources/exlib/**']);
});

test('should support negative patterns', t => {
    const patterns = composePatterns(['source-dir/**', '!sources/exlib/**']);

    t.deepEqual(patterns, ['source-dir/**', '!sources/exlib/**']);
});

test('should support patterns as string', t => {
    const patterns = composePatterns('source-dir/**');

    t.deepEqual(patterns, ['source-dir/**']);
});

test('should support includes as string', async t => {
    const patterns = composePatterns([], { include: 'source-dir/**' });

    t.deepEqual(patterns, ['source-dir/**']);
});

test('should support excludes as string', async t => {
    const patterns = composePatterns(['source-dir/**'], { exclude: ['source-dir/file-2.txt'] });

    t.deepEqual(patterns, ['source-dir/**', '!source-dir/file-2.txt']);
});

test('should support excludes with negative patterns', async t => {
    const patterns = composePatterns(['source-dir/**'], { exclude: '!source-dir/file-2.txt' });

    t.deepEqual(patterns, ['source-dir/**', '!source-dir/file-2.txt']);
});
