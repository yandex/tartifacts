'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

const artifact = {
    name: 'tartifact',
    patterns: ['lib/**']
};

test('should create artifact with cwd root', t => {
    const task = new ArtifactTask(artifact);

    t.is(task.artifact.root, process.cwd());
});

test('should create artifact with default options', t => {
    const task = new ArtifactTask(artifact);

    t.deepEqual(task.settings, {
        tar: false,
        gzip: false,
        gzipOptions: { level: 1 },

        followSymlinks: false,
        dotFiles: true,
        emptyFiles: true,
        emptyDirs: true,
        transformStreams: []
    });
});

test('should create artifact with default gzip options', t => {
    const task = new ArtifactTask(artifact, { tar: true, gzip: true });

    t.deepEqual(task.settings.gzipOptions, { level: 1 });
});
