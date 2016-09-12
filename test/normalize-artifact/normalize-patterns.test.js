'use strict';

const test = require('ava');

const normalizeArtifact = require('../../lib/normalize-artifact');

test('should keep patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**']);
});

test('should convert includes to patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        includes: ['source-dir/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**']);
});

test('should convert excludes to patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        excludes: ['source-dir/exlib/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', '!source-dir/exlib/**']);
});

test('should merge includes with patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        includes: ['sources/exlib/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', 'sources/exlib/**']);
});

test('should merge excludes with patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        excludes: ['sources/exlib/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', '!sources/exlib/**']);
});

test('should support negative patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**', '!sources/exlib/**']
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', '!sources/exlib/**']);
});

test('should support patterns as string', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: 'source-dir/**'
    });

    t.deepEqual(artifact.patterns, ['source-dir/**']);
});

test('should support includes as string', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        includes: 'source-dir/**'
    });

    t.deepEqual(artifact.patterns, ['source-dir/**']);
});

test('should support excludes as string', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        excludes: 'source-dir/file-2.txt'
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', '!source-dir/file-2.txt']);
});

test('should support excludes with negative patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        excludes: '!source-dir/file-2.txt'
    });

    t.deepEqual(artifact.patterns, ['source-dir/**', '!source-dir/file-2.txt']);
});
