'use strict';

const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const streamify = require('stream-array');
const tar = require('tar');

const TarStream = require('../../lib/streams').TarStream;

const root = path.resolve('source-dir');
const dest = path.resolve('dest.tar');
const resdir = path.resolve('res-dir');

test.afterEach(() => mockFs.restore());

test('should create tarball with files', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await packFiles(['file-1.txt', 'file-2.txt']);

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), ['file-1.txt', 'file-2.txt']);
});

test('should take into account contents of file', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['file-1.txt']);

    const files = await parseFiles();

    t.deepEqual(files, [{ path: 'file-1.txt', contents: 'Hi!' }]);
});

test('should create tarball with subdirs', async t => {
    mockFs({
        'source-dir': {
            'sub-dir': {
                'file-1.txt': 'Hi!',
                'file-2.txt': 'Hello!'
            }
        }
    });

    await packFiles(['sub-dir/file-1.txt', 'sub-dir/file-2.txt']);

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), ['sub-dir/file-1.txt', 'sub-dir/file-2.txt']);
});

test('should include directory without files', async t => {
    mockFs({
        'source-dir': {
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await packFiles(['sub-dir/']);

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), ['sub-dir/']);
});

test('should ignore directory without files', async t => {
    mockFs({
        'source-dir': {
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await packFiles(['sub-dir/'], { emptyDirs: false });

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), []);
});

test('should take into account symlink to file', async t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: '../file-1.txt'
            })
        }
    });

    await packFiles(['symlink.txt']);

    const files = await parseFiles(resdir);

    t.deepEqual(files, [{ path: 'symlink.txt', contents: null, linkpath: '../file-1.txt' }]);
});

test('should take into account symlink to dir if emptyDirs is true', async t => {
    mockFs({
        'dir': {
            'file-1.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: '../dir'
            })
        }
    });

    await packFiles(['symdir/'], { emptyDirs: true });

    const files = await parseFiles(resdir);

    t.deepEqual(files, [{ path: 'symdir', contents: null, linkpath: '../dir' }]);
});

test('should take into account symlink to dir if emptyDirs is false', async t => {
    mockFs({
        'dir': {
            'file-1.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: '../dir'
            })
        }
    });

    await packFiles(['symdir/'], { emptyDirs: false });

    const files = await parseFiles(resdir);

    t.deepEqual(files, [{ path: 'symdir', contents: null, linkpath: '../dir' }]);
});

test('should take into broken symlinks', async t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: '../no-file'
            })
        }
    });

    await packFiles(['symlink.txt']);

    const files = await parseFiles();

    t.deepEqual(files, [{ path: 'symlink.txt', contents: null, linkpath: '../no-file' }]);
});

test('should include empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['empty-file.txt', 'file-1.txt']);

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), ['empty-file.txt', 'file-1.txt']);
});

test('should ignore empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['empty-file.txt', 'file-1.txt'], { emptyFiles: false });

    const files = await parseFiles();

    t.deepEqual(files.map(file => file.path), ['file-1.txt']);
});

test('should emit error if file file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(packFiles(['no-file.txt']), /no such file or directory/);
});

function packFiles(filenames, options) {
    return new Promise((resolve, reject) => {
        findFiles(filenames)
            .on('error', reject)
            .pipe(new TarStream(dest, options))
            .on('error', reject)
            .on('close', resolve);
    });
}

function parseFiles() {
    const files = [];

    return tar.list({
        file: dest,
        onentry: entry => {
            if (entry.size === 0) {
                files.push({ path: entry.path, contents: null, linkpath: entry.linkpath });
            } else {
                entry.on('data', buf => {
                    files.push({ path: entry.path, contents: buf.toString('utf-8') })
                });
            }
        }
    }).then(() => files);
}

function findFiles(filenames) {
    const files = filenames.map(basename => {
        return { path: path.join(root, basename), base: root, cwd: root };
    });

    return streamify(files);
}
