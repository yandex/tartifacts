'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifacts = require('../../lib/artifacts').writeArtifacts;

test.afterEach(() => mockFs.restore());

test('should not create artifact', async () => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifacts();
});

test('should create artifact', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifacts({ dest: 'dest-dir', patterns: 'source-dir/' });

    const files = fs.readdirSync('dest-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create artifacts', async t => {
    mockFs({
        'source-dir1': {},
        'source-dir2': {}
    });

    await writeArtifacts([
        { dest: 'dest-dir1', patterns: 'source-dir1/' },
        { dest: 'dest-dir2', patterns: 'source-dir2/' }
    ]);

    const files1 = fs.readdirSync('dest-dir1');
    const files2 = fs.readdirSync('dest-dir2');

    t.deepEqual(files1, ['source-dir1']);
    t.deepEqual(files2, ['source-dir2']);
});

test('should create artifacts consider options', async t => {
    mockFs({
        'source-dir1': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        },
        'source-dir2': {
            '.dot-file': 'bla',
            'file-2.txt': 'Hi!'
        }
    });

    await writeArtifacts([
        { dest: 'dest-dir1', patterns: 'source-dir1/**' },
        { dest: 'dest-dir2', patterns: 'source-dir2/**' }
    ], { dotFiles: false });

    const files1 = fs.readdirSync('./dest-dir1/source-dir1');
    const files2 = fs.readdirSync('./dest-dir2/source-dir2');

    t.deepEqual(files1, ['file-1.txt']);
    t.deepEqual(files2, ['file-2.txt']);
});
