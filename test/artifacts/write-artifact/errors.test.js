'use strict';

const stream = require('stream');

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

test.afterEach(() => mockFs.restore());

class CustomStream extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encode, cb) {
        this.push(chunk);

        cb(new Error('Some Error'));
    }
}

test('should throw error if artifact task has error', t => {
    t.throws(
        writeArtifact({}),
        /you should specify the dest path for artifact/
    );
});

test('should throw error if include file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ name: 'artifact-dir', patterns: 'source-dir/no-file.txt' }),
        /File not found/
    );
});

test('should handler error from transform stream ', t => {
    mockFs({
        'source-dir': {
            'file.txt': 'hello'
        }
    });

    t.throws(
        writeArtifact({ name: 'artifact-dir', patterns: 'source-dir/file.txt', transformStreams: [new CustomStream] }),
        /Some Error/
    );
});
