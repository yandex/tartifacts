'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');

const copySymlink = require('../../lib/fs').copySymlink;

test.afterEach(() => mockFs.restore());

test('should throw error if file is not found', t => {
    mockFs({});

    t.throws(copySymlink('file.txt', 'symlink2.txt'));
});

test('should throw error if file is not symlink', async t => {
    mockFs({
        'file.txt': ''
    });

    t.throws(copySymlink('file.txt', 'symlink2.txt'));
});

test('should create symlink', async t => {
    mockFs({
        'file.txt': '',
        'symlink.txt': mockFs.symlink({
            path: 'file.txt'
        })
    });

    await copySymlink('symlink.txt', 'symlink2.txt');

    t.is(fs.readlinkSync('symlink2.txt'), 'file.txt');
});

test('should create dir', async t => {
    mockFs({
        'file.txt': '',
        'symlink.txt': mockFs.symlink({
            path: 'file.txt'
        })
    });

    await copySymlink('symlink.txt', path.join('dir', 'symlink2.txt'));

    t.deepEqual(fs.readdirSync('dir'), ['symlink2.txt']);
});

test('should not create dir if already exists', async t => {
    mockFs({
        'file.txt': '',
        'symlink.txt': mockFs.symlink({
            path: 'file.txt'
        }),
        'dir': {}
    });

    await copySymlink('symlink.txt', path.join('dir', 'symlink2.txt'));

    t.deepEqual(fs.readdirSync('dir'), ['symlink2.txt']);
});

test('should not change target path', async t => {
    mockFs({
        'file.txt': '',
        'symlink.txt': mockFs.symlink({
            path: 'file.txt'
        })
    });

    await copySymlink('symlink.txt', path.join('dir', 'symlink2.txt'));

    t.is(fs.readlinkSync(path.join('dir','symlink2.txt')), 'file.txt');
});

test('should use specified fs', async t => {
    mockFs({
        'file.txt': '',
        'symlink.txt': mockFs.symlink({
            path: 'file.txt'
        })
    });

    const userFs = {
        readlink: (file, cb) => cb(null, 'fake_target'),
        symlink: fs.symlink,
        mkdir: fs.mkdir,
        stat: fs.stat
    };

    await copySymlink('symlink.txt', 'symlink2.txt', { fs: userFs });

    t.is(fs.readlinkSync('symlink2.txt'), 'fake_target');
});
