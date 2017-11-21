'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

test('should include dot files by default', async t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({
        dest: 'dest-dir',
        includes: ['source-dir/**']
    });

    const files = fs.readdirSync('./dest-dir/source-dir');

    t.deepEqual(files, ['.dot-file', 'file-1.txt']);
});

test('should ignore dot files', async t => {
    mockFs({
        'source-dir': {
            '.dot-file': 'bla',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({
        dest: 'dest-dir',
        includes: ['source-dir/**']
    }, { dotFiles: false });

    const files = fs.readdirSync('dest-dir/source-dir');

    t.deepEqual(files, ['file-1.txt']);
});
