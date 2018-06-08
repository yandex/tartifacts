'use strict';

const test = require('ava');

const config = require('../../lib/config');

const formatOptions = (globalOptions, customOptions) => {
    return config.format(globalOptions, Object.assign({ name: 'tartifact', patterns: ['lib/**'] }, customOptions));
};

test('should override global "tar" options by custom one', t => {
    const options = formatOptions({ tar: true }, { tar: false });

    t.true(options.tar);
});

test('should override global "gzip" option by custom one', t => {
    const options = formatOptions({ tar: true, gzip: true }, { tar: false, gzip: false });

    t.true(options.gzip);
});

test('should use custom "gzipOptions"', t => {
    const options = formatOptions({ tar: true, gzip: { level: 10 } }, { tar: true, gzip: true });

    t.true(options.gzip);
    t.deepEqual(options.gzipOptions, { level: 10 });
});

test('should override global "followSymlinks" option by custom one', t => {
    const options = formatOptions({ followSymlinks: true }, { followSymlinks: false });

    t.true(options.followSymlinks);
});

test('should override global "dotFiles" option by custom one', t => {
    const options = formatOptions({ dotFiles: true }, { dotFiles: false });

    t.true(options.dotFiles);
});

test('should override global "emptyFiles" option by custom one', t => {
    const options = formatOptions({ emptyFiles: true }, { emptyFiles: false });

    t.true(options.emptyFiles);
});

test('should override global "emptyDirs" option by custom one', t => {
    const options = formatOptions({ emptyDirs: true }, { emptyDirs: false });

    t.true(options.emptyDirs);
});

test('should override global "watch" option by custom one', t => {
    const options = formatOptions({ watch: true }, { watch: false });

    t.true(options.watch);
});
