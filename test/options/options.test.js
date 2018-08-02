'use strict';

const path = require('path');
const test = require('ava');

const config = require('../../lib/config');

const root = path.resolve('/root');

const formatOptions = (options) => config.format(Object.assign({ name: 'tartifact', patterns: ['lib/**'] }, options));

test('should format options with absolute root', t => {
    const options = formatOptions({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(options.root, path.resolve('/root'));
});

test('should format options with relative root', t => {
    const options = formatOptions({ name: 'tartifact', patterns: ['lib/**'], root: './root' });

    t.is(options.root, path.join(process.cwd(), './root'));
});

test('should format options with specified name', t => {
    const options = formatOptions({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(options.name, 'tartifact');
});

test('should build path of artifact by name', t => {
    const options = formatOptions({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/root/tartifact'));
});

test('should build path by relative dest', t => {
    const options = formatOptions({ dest: '../tartifact', patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/tartifact'));
});

test('should build path by absolute dest', t => {
    const options = formatOptions({ dest: path.resolve('/tartifact'), patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/tartifact'));
});

test('should build path of artifact by name and relative dest dir', t => {
    const options = formatOptions({ name: 'tartifact', destDir: 'dest', patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/root/dest/tartifact'));
});

test('should build path of artifact by name and absolute dest dir', t => {
    const options = formatOptions({ name: 'tartifact', destDir: path.resolve('/dest'), patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/dest/tartifact'));
});

test('should build path by relative dest and dest dir', t => {
    const options = formatOptions({ dest: '../tartifact', destDir: 'dest', patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/root/tartifact'));
});

test('should build path by absolute dest and dest dir', t => {
    const options = formatOptions({ dest: path.resolve('/tartifact'), destDir: 'dest', patterns: ['lib/**'], root });

    t.is(options.path, path.resolve('/tartifact'));
});

test('should build patterns', t => {
    const options = formatOptions({ name: 'tartifact', patterns: 'lib/**', includes: ['test/**'], excludes: ['exlib/**'] });

    t.deepEqual(options.patterns, { '.': ['lib/**', 'test/**', '!exlib/**'] });
});

test('should format options with falsey "tar" option', t => {
    const options = formatOptions({ tar: false });

    t.false(options.tar);
});

test('should format options with falsey "gzip" option', t => {
    const options = formatOptions({ tar: true, gzip: false });

    t.false(options.gzip);
});

test('should format options with falsey "followSymlinks" option', t => {
    const options = formatOptions({ followSymlinks: false });

    t.false(options.followSymlinks);
});

test('should format options with falsey "dotFiles" option', t => {
    const options = formatOptions({ dotFiles: false });

    t.false(options.dotFiles);
});

test('should format options with falsey "emptyFiles" option', t => {
    const options = formatOptions({ emptyFiles: false });

    t.false(options.emptyFiles);
});

test('should format options with falsey "emptyDirs" option', t => {
    const options = formatOptions({ emptyDirs: false });

    t.false(options.emptyDirs);
});

test('should format options with falsey "watch" options', t => {
    const options = formatOptions({ watch: false });

    t.false(options.watch);
});

test('should format options with truthy "tar" option', t => {
    const options = formatOptions({ tar: true });

    t.true(options.tar);
});

test('should format options with truthy "gzip" option', t => {
    const options = formatOptions({ tar: true, gzip: true });

    t.true(options.gzip);
});

test('should format options with "gzipOptions option"', t => {
    const options = formatOptions({ tar: true, gzip: { level: 10 } });

    t.true(options.gzip);
    t.deepEqual(options.gzipOptions, { level: 10 });
});

test('should format options with truthy "followSymlinks" option', t => {
    const options = formatOptions({ followSymlinks: true });

    t.true(options.followSymlinks);
});

test('should format options with truthy "dotFiles" option', t => {
    const options = formatOptions({ dotFiles: true });

    t.true(options.dotFiles);
});

test('should format options with falsey "emptyFiles" option', t => {
    const options = formatOptions({ emptyFiles: true });

    t.true(options.emptyFiles);
});

test('should format options with falsey "emptyDirs" option', t => {
    const options = formatOptions({ emptyDirs: true });

    t.true(options.emptyDirs);
});

test('should format options with "transform" option', t => {
    const func = () => {};
    const options = formatOptions({ transform: func });

    t.is(options.transform, func);
});

test('should format options with falsey "watch" options', t => {
    const options = formatOptions({ watch: true });

    t.true(options.watch);
});
