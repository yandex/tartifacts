'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

test('should create artifact dir by name', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ name: 'artifact-dir', patterns: ['source-dir/'] });

    const files = fs.readdirSync('artifact-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dest dir by dest', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: 'dest-dir', patterns: ['source-dir/'] });

    const files = fs.readdirSync('dest-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dest dir from root', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ root: '/root', dest: 'dest-dir', patterns: ['source-dir/'] });

    const stats = fs.statSync('/root/dest-dir/');

    t.true(stats.isDirectory());
});

test('should create dir by depth path', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: './path/to/dest-dir/', patterns: 'source-dir/' });

    const stats = fs.statSync('./path/to/dest-dir/');

    t.true(stats.isDirectory());
});
