'use strict';

const test = require('ava');

const composePatterns = require('../../../lib/patterns').compose;

test('should throw error if include or patterns param is not specified', t => {
    t.throws(
        () => composePatterns(),
        'you should specify the includes or patterns parameters for artifact.'
    );
});

test('should throw error if includes param is negative patterns', t => {
    t.throws(
        () => composePatterns([], { include: '!source-dir/**' }),
        'the includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if includes has negative patterns', t => {
    t.throws(
        () => composePatterns([], { include: ['source-dir/file-1.txt', '!source-dir/file-2.txt'] }),
        'the includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if patterns param is negative patterns', t => {
    t.throws(
        () => composePatterns('!source-dir/**'),
        'the first pattern of artifact should not be is negative.'
    );
});

test('should throw error if first pattern is negative glob', t => {
    t.throws(
        () => composePatterns(['!source-dir/**', 'source-dir/file-1.txt']),
        'the first pattern of artifact should not be is negative.'
    );
});
