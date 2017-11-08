'use strict';

const test = require('ava');
const path = require('path');
const getArtifactsInfoList = require('../../lib/cli-helpers').getArtifactsInfoList;

test('should return config content in case of specified within options', t => {
    const configPath = './test/cli-helpers/config.fixture.js';
    const artifacts = getArtifactsInfoList({
        config: configPath,
        dest: '../web4.tar.gz',
        patterns: ['*.js', '*.md'],
        includes: [],
        excludes: ['node_modules'],
        tar: true,
        gzip: true
    });

    t.is(artifacts, require(path.resolve(configPath)));
});

test('should return artifacts based on options in case if config not specified', t => {
    const artifacts = getArtifactsInfoList({
        dest: '../web4.tar.gz',
    });

    t.deepEqual(artifacts, [{
        dest: '../web4.tar.gz',
        patterns: undefined,
        includes: [],
        excludes: [],
        tar: true,
        gzip: true
    }]); 
});

test('should load patterns if options.patterns is specified', t => {
    const patternsPath = './test/cli-helpers/patterns.fixtures.js';
    const artifacts = getArtifactsInfoList({
        dest: '../web4.tar.gz',
        patterns: patternsPath
    });

    t.deepEqual(artifacts, [{
        dest: '../web4.tar.gz',
        patterns: require(path.resolve(patternsPath)),
        includes: [],
        excludes: [],
        tar: true,
        gzip: true
    }]);
})