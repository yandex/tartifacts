'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

const artifact = {
    name: 'tartifact',
    patterns: ['lib/**']
};

test('should create copy artifact', t => {
    const task = new ArtifactTask(artifact, { tar: false });

    t.false(task.settings.tar);
});

test('should create tar artifact', t => {
    const task = new ArtifactTask(artifact, { tar: true });

    t.true(task.settings.tar);
});

test('should create tar.gz artifact', t => {
    const task = new ArtifactTask(artifact, { tar: true, gzip: true });

    t.true(task.settings.gzip);
});

test('should create tar.gz artifact with gzip options', t => {
    const task = new ArtifactTask(artifact, { tar: true, gzip: { level: 10 } });

    t.true(task.settings.gzip);
    t.deepEqual(task.settings.gzipOptions, { level: 10 });
});

test('should create task with follow symlinks', t => {
    const task = new ArtifactTask(artifact, { followSymlinks: true });

    t.true(task.settings.followSymlinks);
});

test('should create task with dot files', t => {
    const task = new ArtifactTask(artifact, { dotFiles: true });

    t.true(task.settings.dotFiles);
});

test('should create task with empty files', t => {
    const task = new ArtifactTask(artifact, { emptyFiles: true });

    t.true(task.settings.emptyFiles);
});

test('should create task with empty dirs', t => {
    const task = new ArtifactTask(artifact, { emptyDirs: true });

    t.true(task.settings.emptyDirs);
});

test('should create task with transform function', t => {
    const func = () => { };

    const task = new ArtifactTask(artifact, { transform: func });

    t.deepEqual(task.settings.transform, func);
});


test('should create task without follow symlinks', t => {
    const task = new ArtifactTask(artifact, { followSymlinks: false });

    t.false(task.settings.followSymlinks);
});

test('should create task without dot files', t => {
    const task = new ArtifactTask(artifact, { dotFiles: false });

    t.false(task.settings.dotFiles);
});

test('should create task without empty files', t => {
    const task = new ArtifactTask(artifact, { emptyFiles: false });

    t.false(task.settings.emptyFiles);
});

test('should create task without empty dirs', t => {
    const task = new ArtifactTask(artifact, { emptyDirs: false });

    t.false(task.settings.emptyDirs);
});
