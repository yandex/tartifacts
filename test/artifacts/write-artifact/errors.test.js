'use strict';

const test = require('ava');
const mockFs = require('mock-fs');

const writeArtifact = require('../../../lib/artifacts').writeArtifact;

const cwd = process.cwd();

test.afterEach(() => mockFs.restore());

test('should throw error if include file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(
        writeArtifact({ dest: 'dest-dir', includes: 'source-dir/no-file.txt' }, { root: cwd }),
        /File not found/
    );
});
