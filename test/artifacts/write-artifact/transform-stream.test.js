'use strict';

const fs = require('fs');
const path = require('path');
const stream = require('stream');

const test = require('ava');
const mockFs = require('mock-fs');
const rename = require('gulp-rename');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

class CustomStream extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encode, cb) {
        if (chunk.extname === '.txt') {
            chunk.dirname = path.resolve(chunk.dirname, 'new-dir');
        }

        this.push(chunk);

        cb();
    }
}

test('should transform chunks by custom stream', async t => {
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
        transformStreams: [new CustomStream()]
    });

    const newDir = fs.readdirSync('artifact-dir/source-dir/new-dir');
    const dir = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(newDir, ['file-1.txt', 'file-2.txt']);
    t.deepEqual(dir, ['file-3.js', 'new-dir']);
});

test('should transform chunks by gulp-rename', async t => {
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
        transformStreams: [rename((file) => {
            if (file.extname === '.txt') {
                file.basename = file.basename + '-suffix';
            }
        })]
    });

    const dir = fs.readdirSync('artifact-dir/source-dir');

    t.deepEqual(dir, ['file-1-suffix.txt', 'file-2-suffix.txt', 'file-3.js']);
});
