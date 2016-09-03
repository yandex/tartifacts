'use strict';

// Immediately invoke all dependencies,
// because of the `copy` module use `lazy-cache` (it can't work with `mock-fs`).
process.env.UNLAZY = true;

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const streamify = require('stream-array');

const CopyFileStream = require('../../lib/streams/copy-stream');

const cwd = process.cwd();
const base = path.resolve('source-dir');
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

    const files = fs.readdirSync(path.join(dest, 'source-dir'));

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should copy file with contents', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    await copyFiles(['file-1.txt']);

    const str = fs.readFileSync(path.join(dest, 'source-dir', 'file-1.txt'), 'utf-8');

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

    const files = fs.readdirSync(path.join(dest, 'source-dir', 'sub-dir'));

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should ignore directory chunk', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await copyFiles(['file-1.txt', 'sub-dir']);

    const files = fs.readdirSync(path.join(dest, 'source-dir'));

    t.deepEqual(files, ['file-1.txt']);
});

test('should copy source file of symlink', async t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: '../file-1.txt'
            })
        }
    });

    await copyFiles(['symlink.txt']);
    fs.unlinkSync('./file-1.txt');

    const str = fs.readFileSync(path.join(dest, 'source-dir', 'symlink.txt'), 'utf-8');

    t.deepEqual(str, 'Hi!');
});

test('should ignore broken symlinks', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'symlink.txt': mockFs.symlink({
                path: 'no-file'
            })
        }
    });

    await copyFiles(['file-1.txt', 'symlink.txt']);

    const files = fs.readdirSync(path.join(dest, 'source-dir'));

    t.deepEqual(files, ['file-1.txt']);
});

test('should ignore empty file', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'empty-file.txt': mockFs.file()
        }
    });

    await copyFiles(['file-1.txt', 'empty-file.txt']);

    const files = fs.readdirSync(path.join(dest, 'source-dir'));

    t.deepEqual(files, ['file-1.txt']);
});

test('should copy empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await copyFiles(['empty-file.txt', 'file-1.txt'], { emptyFiles: true });

    const files = fs.readdirSync(path.join(dest, 'source-dir'));

    t.deepEqual(files, ['empty-file.txt', 'file-1.txt']);
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
            .pipe(new CopyFileStream(dest, options))
            .on('error', reject)
            .on('finish', resolve);
    });
}

function findFiles(filenames) {
    const files = filenames.map(basename => {
        return { path: path.join(base, basename), base, cwd };
    });

    return streamify(files);
}
