'use strict';

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');
const promisify = require('es6-promisify');
const isTar = require('is-tar');
const isGzip = require('is-gzip');

const writeArtifact = promisify(require('../../lib/write-artifact'));

test.afterEach(() => mockFs.restore());

test('should pack to tarball', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-file',
            includes: 'source-dir/**',
            tar: true
        })
        .then(() => {
            const tarball = fs.readFileSync('dest-file');

            t.true(isTar(tarball));
        });
});

test('should pack to tarball with gzip', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-file',
            includes: 'source-dir/**',
            tar: true,
            gzip: true
        })
        .then(() => {
            const gz = fs.readFileSync('dest-file');

            t.true(isGzip(gz));
        });
});

test('should pack to tarball with gzip using gzip options', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({
            dest: 'dest-file',
            includes: 'source-dir/**',
            tar: true,
            gzip: { level: 1 }
        })
        .then(() => {
            const gz = fs.readFileSync('dest-file');

            t.true(isGzip(gz));
        });
});
