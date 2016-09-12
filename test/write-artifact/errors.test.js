'use strict';

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));

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
