'use strict';

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should throw error if artifact task has error', t => {
    t.throws(
        () => writeArtifacts({}),
        /Option "dest" or "name" must be specified for each artifact/
    );
});

test('should throw error if include file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/no-file.txt' }),
        /File not found/
    );
});

test('should handle error from transform function', t => {
    mockFs({
        'source-dir': {
            'file.txt': 'hello!'
        }
    });

    const brokenTransform = () => { throw new Error('some error') };

    t.throws(
        writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/file.txt', transform: brokenTransform }),
        /some error/
    );
});
