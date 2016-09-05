'use strict';

const fs = require('fs');

const test = require('ava');
const promisify = require('es6-promisify');
const mockFs = require('mock-fs');

const writeArtifact = promisify(require('../../lib/write-artifact'));

test.afterEach(() => mockFs.restore());

test('should create dest dir', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: 'dest-dir', includes: ['source-dir/'] });
    const files = fs.readdirSync('dest-dir');

    t.deepEqual(files, ['source-dir']);
});

test('should create dir by depth path', async t => {
    mockFs({
        'source-dir': {}
    });

    await writeArtifact({ dest: './path/to/dest-dir/', includes: ['source-dir/'] });
    const stats = fs.statSync('./path/to/dest-dir/');

    t.true(stats.isDirectory());
});
