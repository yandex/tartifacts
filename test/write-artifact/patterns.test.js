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

test('should include files', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-dir',
            patterns: ['source-dir/**']
        })
        .then(() => {
            const files = fs.readdirSync('dest-dir/source-dir');

            t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
        });
});

test('should exclude files', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-dir',
            patterns: ['source-dir/**', '!source-dir/file-2.txt']
        })
        .then(() => {
            const files = fs.readdirSync('dest-dir/source-dir');

            t.deepEqual(files, ['file-1.txt']);
        });
});

test('should override negative pattern', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-dir',
            patterns: [
                'source-dir/**',
                '!source-dir/file-2.txt',
                'source-dir/file-2.txt'
            ]
        })
        .then(() => {
            const files = fs.readdirSync('dest-dir/source-dir');

            t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
        });
});
