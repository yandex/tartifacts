'use strict';

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));

test.afterEach(() => mockFs.restore());

test('should throw error if dest is not specified', t => {
    t.throws(writeArtifact(), 'You should specify the dest for artifact.');
});

test('should throw error if include or patterns param is not specified', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir' }),
        'You should specify the includes or patterns parameters for artifact.'
    );
});

test('should throw error if includes param is negative patterns', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', includes: '!source-dir/**' }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if includes has negative patterns', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', includes: ['source-dir/file-1.txt', '!source-dir/file-2.txt'] }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if patterns param is negative patterns', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', patterns: '!source-dir/**' }),
        'The first pattern of artifact should not be is negative.'
    );
});

test('should throw error if first pattern is negative glob', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', patterns: ['!source-dir/**', 'source-dir/file-1.txt'] }),
        'The first pattern of artifact should not be is negative.'
    );
});

test('should throw error if include file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', includes: 'source-dir/no-file.txt' }),
        /File not found/
    );
});
