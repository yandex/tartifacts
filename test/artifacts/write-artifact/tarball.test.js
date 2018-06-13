'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');
const isTar = require('is-tar');
const isGzip = require('is-gzip');

const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should pack to tarball',  async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({ name: 'artifact.tar', patterns: 'source-dir/**' }, { tar: true });

    const archive = fs.readFileSync('artifact.tar');

    t.true(isTar(archive));
});

test('should pack to tarball with gzip', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({ name: 'artifact.tar.gz', patterns: 'source-dir/**'}, { tar: true, gzip: true });

    const archive = fs.readFileSync('artifact.tar.gz');

    t.true(isGzip(archive));
});

test('should pack to tarball with gzip using gzip options', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await writeArtifacts({ name: 'artifact.tar.gz', patterns: 'source-dir/**' }, { tar: true, gzip: { level: 1 } });

    const gz = fs.readFileSync('artifact.tar.gz');

    t.true(isGzip(gz));
});
