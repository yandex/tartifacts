'use strict';

const fs = require('fs');

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));
const cwd = process.cwd();

test.afterEach(() => mockFs.restore());

test('should create dest dir', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: 'dest-dir', includes: ['source-dir/'] }, { root: cwd, emptyDirs: true });
    const files = fs.readdirSync('dest-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dest dir from root', async t => {
    mockFs({
        '/root/source-dir': {}
    });

    await writeArtifact({ dest: 'dest-dir', includes: ['source-dir/'] }, {
        root: '/root',
        emptyDirs: true
    });

    const stats = fs.statSync('/root/dest-dir/');

    t.true(stats.isDirectory());
});

test('should create dir by depth path', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: './path/to/dest-dir/', includes: ['source-dir/'] }, { root: cwd, emptyDirs: true });
    const stats = fs.statSync('./path/to/dest-dir/');

    t.true(stats.isDirectory());
});
