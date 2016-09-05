'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));
const cwd = process.cwd();

test.afterEach(() => mockFs.restore());

test('should not include dot files by default', async t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({
        dest: 'dest-dir',
        includes: ['source-dir/**']
    }, { root: cwd });

    const files = fs.readdirSync('dest-dir/source-dir');

    t.deepEqual(files, ['file-1.txt']);
});

test('should include dot file', async t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({
        dest: 'dest-dir',
        includes: ['source-dir/**']
    }, { root: cwd, dotFiles: true });

    const files = fs.readdirSync('dest-dir/source-dir');

    t.deepEqual(files, ['.dot-file', 'file-1.txt']);
});
