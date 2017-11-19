'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

test('should throw error if dest path is not specified', t => {
    t.throws(
        () => new ArtifactTask({ patterns: ['lib/**'] }),
        'you should specify the dest path for artifact.'
    );
});

test('should not throw error if name is specified instead of dest', t => {
    t.notThrows(
        () => new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'] })
    );
});

test('should throw error if patterns is not specified', t => {
    t.throws(
        () => new ArtifactTask({ dest: './dest-dir' }),
        'you should specify the includes or patterns parameters for artifact.'
    );
});

test('should not throw error if includes is specified instead of patterns', t => {
    t.notThrows(
        () => new ArtifactTask({ dest: './dest-dir', includes: ['lib/**'] })
    );
});

test('should throw error if patterns have errors', t => {
    t.throws(
        () => new ArtifactTask({ dest: './dest-dir', patterns: ['!exlib/**'] }),
        'the first pattern of artifact should not be is negative.'
    );
});

test('should throw error if not archive with gzip', t => {
    t.throws(
        () => new ArtifactTask({ dest: './dest-dir', patterns: ['lib/**'] }, { gzip: true }),
        'it is impossible to create not archive artifact with gzip. You should turn on the tar setting.'
    );
});
