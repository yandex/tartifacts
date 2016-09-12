'use strict';

const test = require('ava');

const normalizeArtifact = require('../../lib/normalize-artifact');

test('should throw error if dest is not specified', t => {
    t.throws(() => normalizeArtifact(), 'You should specify the dest for artifact.');
});

test('should throw error if include or patterns param is not specified', t => {
    t.throws(
        () => normalizeArtifact({ dest: 'dest-dir' }),
        'You should specify the includes or patterns parameters for artifact.'
    );
});

test('should throw error if includes param is negative patterns', t => {
    t.throws(
        () => normalizeArtifact({ dest: 'dest-dir', includes: '!source-dir/**' }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if includes has negative patterns', t => {
    t.throws(
        () => normalizeArtifact({ dest: 'dest-dir', includes: ['source-dir/file-1.txt', '!source-dir/file-2.txt'] }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if patterns param is negative patterns', t => {
    t.throws(
        () => normalizeArtifact({ dest: 'dest-dir', patterns: '!source-dir/**' }),
        'The first pattern of artifact should not be is negative.'
    );
});

test('should throw error if first pattern is negative glob', t => {
    t.throws(
        () => normalizeArtifact({ dest: 'dest-dir', patterns: ['!source-dir/**', 'source-dir/file-1.txt'] }),
        'The first pattern of artifact should not be is negative.'
    );
});
