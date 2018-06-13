'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../lib');

test.afterEach(() => mockFs.restore());

const transform = (dir) => {
    return (chunk) => {
        const f = path.parse(chunk.path);

        if (f.ext === '.txt') {
            chunk.path = path.join(f.dir, dir, f.base);
        }

        return chunk;
    };
};

const transformWithAddChunk = (dir) => {
    return (chunk) => {
        const chunks = [];
        const f = path.parse(chunk.path);

        if (f.ext === '.txt') {
            chunk.path = path.join(f.dir, dir, f.base);

            chunks.push(chunk, Object.assign({}, chunk, {
                path: chunk.path.replace('txt', 'md')
            }));
        }

        return chunks.length ? chunks : chunk;
    };
};

test('should transform chunks by transform function', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!',
            'file-3.js': 'good bye!'
        }
    });

    await writeArtifact({
        dest: 'artifact-dir',
        patterns: 'source-dir/**',
        transform: transform('new-dir')
    });

    const newDir = fs.readdirSync('artifact-dir/source-dir/new-dir');
    const dir = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(newDir, ['file-1.txt', 'file-2.txt']);
    t.deepEqual(dir, ['file-3.js', 'new-dir']);
});

test('should handle one more chunk from transform function', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!',
            'file-3.js': 'good bye!'
        }
    });

    await writeArtifact({
        dest: 'artifact-dir',
        patterns: 'source-dir/**',
        transform: transformWithAddChunk('new-dir')
    });

    const newDir = fs.readdirSync('artifact-dir/source-dir/new-dir');
    const dir = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(newDir, ['file-1.md', 'file-1.txt', 'file-2.md', 'file-2.txt']);
    t.deepEqual(dir, ['file-3.js', 'new-dir']);
});
