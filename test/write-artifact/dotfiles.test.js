'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));

test.afterEach(() => mockFs.restore());

test('should not include dot files by default', t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    return writeArtifact({
            dest: 'dest-dir',
            includes: ['source-dir/**']
        })
        .then(() => {
            const files = fs.readdirSync('dest-dir/source-dir');

            t.deepEqual(files, ['file-1.txt']);
        });
});

test('should include dot file', t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    return writeArtifact({
            dest: 'dest-dir',
            includes: ['source-dir/**']
        }, { dotFiles: true })
        .then(() => {
            const files = fs.readdirSync('dest-dir/source-dir');

            t.deepEqual(files, ['.dot-file', 'file-1.txt']);
        });
});
