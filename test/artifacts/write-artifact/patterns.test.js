'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should include files', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: ['source-dir/**'] });

    const files = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should exclude files', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: ['source-dir/**', '!source-dir/file-2.txt'] });

    const files = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(files, ['file-1.txt']);
});

test('should override negative pattern', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({
        name: 'artifact-dir',
        patterns: [
            'source-dir/**',
            '!source-dir/file-2.txt',
            'source-dir/file-2.txt'
        ]
    });

    const files = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});
