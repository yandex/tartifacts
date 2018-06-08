'use strict';

const test = require('ava');

const config = require('../../lib/config');

test('should throw error if dest path is not specified', t => {
    t.throws(
        () => config.format({ patterns: ['lib/**'] }),
        'Option "dest" or "name" must be specified for each artifact'
    );
});

test('should not throw error if name is specified instead of dest', t => {
    t.notThrows(
        () => config.format({ name: 'tartifact', patterns: ['lib/**'] })
    );
});

test('should throw error if patterns is not specified', t => {
    t.throws(
        () => config.format({ dest: './dest-dir' }),
        'you should specify the includes or patterns parameters for artifact.'
    );
});

test('should not throw error if includes is specified instead of patterns', t => {
    t.notThrows(
        () => config.format({ dest: './dest-dir', includes: ['lib/**'] })
    );
});

test('should throw error if patterns have errors', t => {
    t.throws(
        () => config.format({ dest: './dest-dir', patterns: ['!exlib/**'] }),
        'the first pattern of artifact should not be is negative.'
    );
});

test('should throw error if not archive with gzip', t => {
    t.throws(
        () => config.format({ dest: './dest-dir', patterns: ['lib/**'] }, { gzip: true }),
        'Option "gzip" must be used only with option "tar"'
    );
});

test('should throw error if transform has non-function type', t => {
    t.throws(
        () => config.format({ dest: './dest-dir', patterns: ['lib/**'], transform: [() => { }, 'hello'] }),
        'Option "transform" must be a function'
    );
});
