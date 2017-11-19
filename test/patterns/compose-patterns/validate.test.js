'use strict';

const test = require('ava');

const composePatterns = require('../../../lib/patterns').compose;

test('should throw error if include or patterns param is not specified', t => {
    t.throws(
        () => composePatterns(),
        'You should specify the includes or patterns parameters for artifact.'
    );
});

test('should throw error if includes param is negative patterns', t => {
    t.throws(
        () => composePatterns([], { include: '!source-dir/**' }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if includes has negative patterns', t => {
    t.throws(
        () => composePatterns([], { include: ['source-dir/file-1.txt', '!source-dir/file-2.txt'] }),
        'The includes parameter of artifact should not contains negative patterns.'
    );
});

test('should throw error if patterns param is negative patterns', t => {
    t.throws(
        () => composePatterns('!source-dir/**'),
        'The first pattern of artifact should not be is negative.'
    );
});

test('should throw error if first pattern is negative glob', t => {
    t.throws(
        () => composePatterns(['!source-dir/**', 'source-dir/file-1.txt']),
        'The first pattern of artifact should not be is negative.'
    );
});
