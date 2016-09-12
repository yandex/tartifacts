'use strict';

const test = require('ava');

const normalizeArtifact = require('../../lib/normalize-artifact');

test('should provide tar field', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        tar: true
    });

    t.true(artifact.tar);
});

test('should provide gzip field', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**'],
        tar: true,
        gzip: { level: 1 }
    });

    t.deepEqual(artifact.gzip, { level: 1 });
});
