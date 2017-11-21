'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

test('should include empty files by default', async t => {
    mockFs({
        'source-dir': {
            'empty-file': '',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({ name: 'artifact-dir', patterns: 'source-dir/**' });

    const files = fs.readdirSync('./artifact-dir/source-dir');

    t.deepEqual(files, ['empty-file', 'file-1.txt']);
});

test('should ignore empty files', async t => {
    mockFs({
        'source-dir': {
            'empty-file': '',
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifact({ name: 'artifact-dir', patterns: 'source-dir/**' }, { emptyFiles: false });

    const files = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(files, ['file-1.txt']);
});
