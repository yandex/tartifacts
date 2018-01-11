'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

const artifact = {
    name: 'tartifact',
    patterns: ['lib/**']
};
const createTask = settings => new ArtifactTask(Object.assign({}, artifact, settings));

test('should create copy artifact', t => {
    const task = createTask({ tar: false });

    t.false(task.settings.tar);
});

test('should create tar artifact', t => {
    const task = createTask({ tar: true });

    t.true(task.settings.tar);
});

test('should create tar.gz artifact', t => {
    const task = createTask({ tar: true, gzip: true });

    t.true(task.settings.gzip);
});

test('should create tar.gz artifact with gzip options', t => {
    const task = createTask({ tar: true, gzip: { level: 10 } });

    t.true(task.settings.gzip);
    t.deepEqual(task.settings.gzipOptions, { level: 10 });
});

test('should create task with follow symlinks', t => {
    const task = createTask({ followSymlinks: true });

    t.true(task.settings.followSymlinks);
});

test('should create task with dot files', t => {
    const task = createTask({ dotFiles: true });

    t.true(task.settings.dotFiles);
});

test('should create task with empty files', t => {
    const task = createTask({ emptyFiles: true });

    t.true(task.settings.emptyFiles);
});

test('should create task with empty dirs', t => {
    const task = createTask({ emptyDirs: true });

    t.true(task.settings.emptyDirs);
});

test('should create task without follow symlinks', t => {
    const task = createTask({ followSymlinks: false });

    t.false(task.settings.followSymlinks);
});

test('should create task without dot files', t => {
    const task = createTask({ dotFiles: false });

    t.false(task.settings.dotFiles);
});

test('should create task without empty files', t => {
    const task = createTask({ emptyFiles: false });

    t.false(task.settings.emptyFiles);
});

test('should create task without empty dirs', t => {
    const task = createTask({ emptyDirs: false });

    t.false(task.settings.emptyDirs);
});
