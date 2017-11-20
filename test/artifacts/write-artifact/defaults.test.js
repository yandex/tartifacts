'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

test('should copy artifact by default', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifact({ dest: 'dest-dir', includes: ['source-dir/**'] });

    const stats = fs.statSync('dest-dir');

    t.true(stats.isDirectory());
});
