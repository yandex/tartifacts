'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const Vinyl = require('vinyl');
const streamify = require('stream-array');

const CopyStream = require('../../lib/streams').CopyStream;

const root = path.resolve('source-dir');
const dest = path.resolve('dest-dir');

test.afterEach(() => mockFs.restore());

test('should not copy empty dir', async t => {
    mockFs({
        'source-dir': {}
    });

    await copyFiles([]);

    const dirs = fs.readdirSync('./');

    t.deepEqual(dirs, ['source-dir']);
});

test('should copy files', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    await copyFiles(['file-1.txt', 'file-2.txt']);

    const files = fs.readdirSync(path.join(dest));

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should copy file with contents', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    await copyFiles(['file-1.txt']);

    const str = fs.readFileSync(path.join(dest, 'file-1.txt'), 'utf-8');

    t.is(str, 'Hi!');
});

test('should copy dir with subdirs', async t => {
    mockFs({
        'source-dir': {
            'sub-dir': {
                'file-1.txt': 'Hi!',
                'file-2.txt': 'Hello!'
            }
        }
    });

    await copyFiles(['sub-dir/file-1.txt', 'sub-dir/file-2.txt']);

    const files = fs.readdirSync(path.join(dest, 'sub-dir'));

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should copy directory without files', async t => {
    mockFs({
        'source-dir': {
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await copyFiles(['sub-dir/']);

    const files = fs.readdirSync(path.join(dest));

    t.deepEqual(files, ['sub-dir']);
});

test('should ignore directory without files', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await copyFiles(['file-1.txt', 'sub-dir/'], { emptyDirs: false });

    const files = fs.readdirSync(path.join(dest));

    t.deepEqual(files, ['file-1.txt']);
});

test('should copy symlink to file', async t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: path.join('..', 'file-1.txt')
            })
        }
    });

    await copyFiles(['symlink.txt']);

    const link = fs.readlinkSync(path.join(dest, 'symlink.txt'));

    t.is(link, path.join('..', 'file-1.txt'));
});

test('should copy symlink to dir if emptyDirs is false', async t => {
    mockFs({
        'dir': {
            'file-1.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: path.join('..', 'dir')
            })
        }
    });

    await copyFiles(['symdir/'], { emptyDirs: false });

    const link = fs.readlinkSync(path.join(dest, 'symdir'));

    t.is(link, path.join('..', 'dir'));
});

test('should copy symlink to dir if emptyDirs is true', async t => {
    mockFs({
        'dir': {
            'file-1.txt': 'Hi!'
        },
        'source-dir': {
            'symdir': mockFs.symlink({
                path: path.join('..', 'dir')
            })
        }
    });

    await copyFiles(['symdir/'], { emptyDirs: true });

    const link = fs.readlinkSync(path.join(dest, 'symdir'));

    t.is(link, path.join('..', 'dir'));
});

test('should copy broken symlinks', async t => {
    mockFs({
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: 'no-file'
            })
        }
    });

    await copyFiles(['symlink.txt']);

    const link = fs.readlinkSync(path.join(dest, 'symlink.txt'));

    t.is(link, 'no-file');
});

test('should copy empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await copyFiles(['empty-file.txt', 'file-1.txt']);

    const files = fs.readdirSync(path.join(dest));

    t.deepEqual(files, ['empty-file.txt', 'file-1.txt']);
});

test('should ignore empty file', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'empty-file.txt': mockFs.file()
        }
    });

    await copyFiles(['file-1.txt', 'empty-file.txt'], { emptyFiles: false });

    const files = fs.readdirSync(path.join(dest));

    t.deepEqual(files, ['file-1.txt']);
});

test('should emit error if file file does not exist', t => {
    mockFs({
        'source-dir': {}
    });

    t.throws(copyFiles(['no-file.txt']), /no such file or directory/);
});

function copyFiles(filenames, options) {
    return new Promise((resolve, reject) => {
        findFiles(filenames)
            .on('error', reject)
            .pipe(new CopyStream(dest, options))
            .on('error', reject)
            .on('finish', resolve);
    });
}

function findFiles(filenames) {
    const files = filenames.map(basename => {
        return new Vinyl({ path: path.join(root, basename), base: root, cwd: root });
    });

    return streamify(files);
}
