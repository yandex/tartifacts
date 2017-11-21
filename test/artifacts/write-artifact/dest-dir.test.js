'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

test('should create artifact in dest-dir', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ destDir: 'dest-dir', name: 'artifact-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('dest-dir/artifact-dir');

    t.true(stats.isDirectory());
});

test('should create artifact relative dest-dir', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ destDir: 'dest-dir' , dest: '../artifact-dir', patterns: ['source-dir/'] });

    const files = fs.readdirSync('.');

    t.deepEqual(files, ['artifact-dir', 'source-dir']);
});

test('should create artifact in root/dest-dir', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ root: '/root', destDir: 'dest-dir', name: 'artifact-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/root/dest-dir/artifact-dir');

    t.true(stats.isDirectory());
});

test('should create artifact relative dest-dir in root', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ root: '/root', destDir: 'dest-dir', dest: '../artifact-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/root/artifact-dir');

    t.true(stats.isDirectory());
});

test('should create artifact in dest-dir by absolute path', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ root: '/root', destDir: '/dest-dir', name: 'artifact-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/dest-dir/artifact-dir');

    t.true(stats.isDirectory());
});

test('should create artifact by absolute dest path', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ root: '/root', destDir: '/dest-dir', dest: '/artifact-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/artifact-dir');

    t.true(stats.isDirectory());
});
