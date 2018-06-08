'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should create artifact dir by name', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: ['source-dir/'] });

    const files = fs.readdirSync('artifact-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dest dir by dest', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifacts({ dest: 'dest-dir', patterns: ['source-dir/'] });

    const files = fs.readdirSync('dest-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dest dir from relative root', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifacts({ root: '/root', dest: 'dest-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/root/dest-dir/');

    t.true(stats.isDirectory());
});

test('should create dir by depth path', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifacts({ dest: './path/to/dest-dir/', patterns: 'source-dir/' });

    const stats = fs.statSync('./path/to/dest-dir/');

    t.true(stats.isDirectory());
});
