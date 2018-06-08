'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should include empty dirs by default', async t => {
    mockFs({
        'source-dir': {
            'empty-dir': {},
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' });

    const files = fs.readdirSync('./artifact-dir/source-dir');

    t.deepEqual(files, ['empty-dir', 'file-1.txt']);
});

test('should ignore empty dirs', async t => {
    mockFs({
        'source-dir': {
            'empty-dir': {},
            'file-1.txt': 'Hi!'
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' }, { emptyDirs: false });

    const files = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(files, ['file-1.txt']);
});
