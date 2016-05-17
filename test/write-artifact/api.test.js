'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../lib/write-artifact');

test.afterEach(() => mockFs.restore());

test('should copy artifact by default', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return writeArtifact({ dest: 'dest-dir', includes: ['source-dir/**'] })
        .then(() => {
            const stats = fs.statSync('dest-dir');

            t.true(stats.isDirectory());
        });
});

test('should support include param as string', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', includes: ['source-dir/**'] }),
        writeArtifact({ dest: 'dest-2', includes: 'source-dir/**' })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});

test('should support exclude param as string', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', includes: ['source-dir/**'], exclude: ['source-dir/file-2.txt'] }),
        writeArtifact({ dest: 'dest-2', includes: ['source-dir/**'], exclude: 'source-dir/file-2.txt' })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});

test('should support patterns param as string', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', patterns: ['source-dir/**'] }),
        writeArtifact({ dest: 'dest-2', patterns: 'source-dir/**' })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});

test('should support patterns as includes', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', includes: ['source-dir/**'] }),
        writeArtifact({ dest: 'dest-2', patterns: ['source-dir/**'] })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});

test('should support patterns as excludes string', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', includes: 'source-dir/**', excludes: ['source-dir/file-1.txt'] }),
        writeArtifact({ dest: 'dest-2', patterns: ['source-dir/**', '!source-dir/file-1.txt'] })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});

test('should support excludes with negative patterns', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return Promise.all([
        writeArtifact({ dest: 'dest-1', includes: 'source-dir/**', excludes: ['source-dir/file-1.txt'] }),
        writeArtifact({ dest: 'dest-2', includes: 'source-dir/**', excludes: ['!source-dir/file-1.txt'] })
    ]).then(() => {
        const files1 = fs.readdirSync('dest-1/source-dir');
        const files2 = fs.readdirSync('dest-2/source-dir');

        t.deepEqual(files1, files2);
    });
});
