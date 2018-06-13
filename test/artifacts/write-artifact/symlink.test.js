'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');

// const writeArtifacts = require('../../../lib/artifacts').writeArtifact;
const writeArtifacts = require('../../../lib');

test.afterEach(() => mockFs.restore());

test('should include symlink to file by default', async t => {
    mockFs({
        'file.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: path.join('..', 'file.txt')
            })
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' });

    const link = fs.readlinkSync(path.join('artifact-dir', 'source-dir', 'symlink.txt'));

    t.is(link, path.join('..', 'file.txt'));
});

test('should include symlink to dir by default', async t => {
    mockFs({
        'dir': {
            'file.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: path.join('..', 'dir')
            })
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' });

    const link = fs.readlinkSync(path.join('artifact-dir', 'source-dir', 'symdir'));

    t.is(link, path.join('..', 'dir'));
});

test('should follow symlink to file', async t => {
    mockFs({
        'file.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: path.join('..', 'file.txt')
            })
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' }, { followSymlinks: true });

    const contents = fs.readFileSync(path.join('artifact-dir', 'source-dir', 'symlink.txt'), 'utf-8');

    t.is(contents, 'Hi!');
});

test('should follow symlink to dir', async t => {
    mockFs({
        'dir': {
            'file.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: path.join('..', 'dir')
            })
        }
    });

    await writeArtifacts({ name: 'artifact-dir', patterns: 'source-dir/**' }, { followSymlinks: true });

    const contents = fs.readFileSync(path.join('artifact-dir', 'source-dir', 'symdir', 'file.txt'), 'utf-8');

    t.is(contents, 'Hi!');
});
