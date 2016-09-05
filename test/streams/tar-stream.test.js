'use strict';

const fs = require('fs');
const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const streamify = require('stream-array');
const tar = require('tar');

const TarStream = require('../../lib/streams/tar-stream');

const cwd = process.cwd();
const base = path.resolve('source-dir');
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
    const files = await extractFiles();

    t.deepEqual(files, ['file-1.txt', 'file-2.txt']);
});

test('should take into account contents of file', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['file-1.txt']);
    await extractFiles(resdir);

    const str = fs.readFileSync(path.join(resdir, 'file-1.txt'), 'utf-8');

    t.is(str, 'Hi!');
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
    const files = await extractFiles();

    t.deepEqual(files, ['sub-dir/file-1.txt', 'sub-dir/file-2.txt']);
});

test('should ignore directory chunk', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'sub-dir': { 'file-2.txt': 'Hello!' }
        }
    });

    await packFiles(['file-1.txt', 'sub-dir']);
    const files = await extractFiles();

    t.deepEqual(files, ['file-1.txt']);
});

test('should take into account symlink', async t => {
    mockFs({
        'file-1.txt': 'Hi!',
        'source-dir': {
            'symlink.txt': mockFs.symlink({
                path: '../file-1.txt'
            })
        }
    });

    await packFiles(['symlink.txt']);
    await extractFiles(resdir);
    fs.unlinkSync('./file-1.txt');

    const str = fs.readFileSync(path.join(resdir, 'symlink.txt'), 'utf-8');

    t.deepEqual(str, 'Hi!');
});

test('should ignore broken symlinks', async t => {
    mockFs({
        'source-dir': {
            'file-1.txt': 'Hi!',
            'symlink.txt': mockFs.symlink({
                path: '../no-file'
            })
        }
    });

    await packFiles(['file-1.txt', 'symlink.txt']);
    const files = await extractFiles();

    t.deepEqual(files, ['file-1.txt']);
});

test('should include empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['empty-file.txt', 'file-1.txt']);
    const files = await extractFiles();

    t.deepEqual(files, ['empty-file.txt', 'file-1.txt']);
});

test('should ignore empty file', async t => {
    mockFs({
        'source-dir': {
            'empty-file.txt': mockFs.file(),
            'file-1.txt': 'Hi!'
        }
    });

    await packFiles(['empty-file.txt', 'file-1.txt'], { emptyFiles: false });
    const files = await extractFiles();

    t.deepEqual(files, ['file-1.txt']);
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

function extractFiles(dir) {
    const files = [];

    return new Promise((resolve, reject) => {
        const rs = fs.createReadStream(dest).on('error', reject);
        const ws = dir
            ? tar.Extract({ path: dir })
            : tar.Parse().on("entry", entry => files.push(entry.props.path));

        rs.pipe(ws)
            .on('error', reject)
            .on('end', () => resolve(files));
    });
}

function findFiles(filenames) {
    const files = filenames.map(basename => {
        return { path: path.join(base, basename), base, cwd };
    });

    return streamify(files);
}
