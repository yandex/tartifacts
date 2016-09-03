'use strict';

const fs = require('fs');

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));

test.afterEach(() => mockFs.restore());

test('should create empty dir', t => {
    mockFs({
        'source-dir': {}
    });

    return writeArtifact({ dest: 'dest-dir', includes: ['source-dir/**'] })
        .then(() => {
            const files = fs.readdirSync('dest-dir');

            t.deepEqual(files, []);
        });
});

test('should create dir by depth path', t => {
    mockFs({
        'source-dir': {}
    });

    return writeArtifact({ dest: './path/to/dest-dir/', includes: ['source-dir/**'] })
        .then(() => {
            const stats = fs.statSync('./path/to/dest-dir/');

            t.true(stats.isDirectory());
        });
});
