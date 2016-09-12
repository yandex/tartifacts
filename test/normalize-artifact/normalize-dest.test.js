'use strict';

const path = require('path');

const test = require('ava');

const normalizeArtifact = require('../../lib/normalize-artifact');

test('should keep patterns', async t => {
    const artifact = normalizeArtifact({
        dest: 'dest',
        patterns: ['source-dir/**']
    }, { root: 'root' });

    t.is(artifact.dest, path.normalize('root/dest'));
});
