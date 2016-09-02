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

test('should not copy empty dir', t => {
    mockFs({
        'source-dir': {}
    });

    return copyFiles([])
        .then(() => {
            const dirs = fs.readdirSync('./');

            t.deepEqual(dirs, ['source-dir']);
        });
});

test('should copy files', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'file-2.txt': 'Hello!'
        }
    });

    return copyFiles(['file-1.txt', 'file-2.txt'])
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir'));

            t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
        });
});

test('should copy file with contents', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    return copyFiles(['file-1.txt'])
        .then(() => {
            const str = fs.readFileSync(path.join(dest, 'source-dir', 'file-1.txt'), 'utf-8');

            t.is(str, 'Hi!');
        });
});

test('should copy dir with subdirs', t => {
    mockFs({
        'source-dir': {
            'sub-dir': {
                'file-1.txt': 'Hi!',
                'file-2.txt': 'Hello!'
            }
        }
    });

    return copyFiles(['sub-dir/file-1.txt', 'sub-dir/file-2.txt'])
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir', 'sub-dir'));

            t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
        });
});

test('should ignore directory chunk', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    return copyFiles(['file-1.txt', 'sub-dir'])
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir'));

            t.deepEqual(files, ['file-1.txt']);
        });
});

test('should copy source file of symlink', t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: '../file-1.txt'
            })
        }
    });

    return copyFiles(['symlink.txt'])
        .then(() => {
            fs.unlinkSync('./file-1.txt');

            const str = fs.readFileSync(path.join(dest, 'source-dir', 'symlink.txt'), 'utf-8');

            t.deepEqual(str, 'Hi!');
        });
});

test('should ignore broken symlinks', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'symlink.txt': mockFs.symlink({
                path: 'no-file'
            })
        }
    });

    return copyFiles(['file-1.txt', 'symlink.txt'])
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir'));

            t.deepEqual(files, ['file-1.txt']);
        });
});

test('should ignore empty file', t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'empty-file.txt': mockFs.file()
        }
    });

    return copyFiles(['file-1.txt', 'empty-file.txt'])
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir'));

            t.deepEqual(files, ['file-1.txt']);
        });
});

test('should copy empty file', t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    return copyFiles(['empty-file.txt', 'file-1.txt'], { emptyFiles: true })
        .then(() => {
            const files = fs.readdirSync(path.join(dest, 'source-dir'));

            t.deepEqual(files, ['empty-file.txt', 'file-1.txt']);
        });
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
