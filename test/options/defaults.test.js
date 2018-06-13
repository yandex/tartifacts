'use strict';

const test = require('ava');

const config = require('../../lib/config');

const formatOptions = (options) => config.format(Object.assign({ name: 'tartifact', patterns: ['lib/**'] }, options));

test('should format options with falsey "tar" option by default', t => {
    const options = formatOptions();

    t.false(options.tar);
});

test('should format options with falsey "gzip" option by default', t => {
    const options = formatOptions({ tar: true });

    t.false(options.gzip);
});

test('should format options with default "gzipOptions" option', t => {
    const options = formatOptions({ tar: true, gzip: true });

    t.true(options.gzip);
    t.deepEqual(options.gzipOptions, { level: 1 });
});

test('should format options with falsey "followSymlinks" option by default', t => {
    const options = formatOptions();

    t.false(options.followSymlinks);
});

test('should format options with truthy "dotFiles" option by default', t => {
    const options = formatOptions();

    t.true(options.dotFiles);
});

test('should format options with truthy "emptyFiles" option by default', t => {
    const options = formatOptions();

    t.true(options.emptyFiles);
});

test('should format options with truthy "emptyDirs" option by default', t => {
    const options = formatOptions();

    t.true(options.emptyDirs);
});

test('should format options without "transform" option by default', t => {
    const options = formatOptions();

    t.is(options.transform, null);
});

test('should format options with falsey "watch" options by default', t => {
    const options = formatOptions();

    t.false(options.watch);
});
