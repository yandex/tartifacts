'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

const artifact = {
    name: 'tartifact',
    patterns: ['lib/**']
};
const createArtifact = settings => Object.assign({}, artifact, settings);

test('should override tar setting', t => {
    const task = new ArtifactTask(createArtifact({ tar: true }), { tar: false });

    t.true(task.settings.tar);
});

test('should override gzip setting', t => {
    const task = new ArtifactTask(createArtifact({ tar: false, gzip: false }), { tar: true, gzip: true });

    t.false(task.settings.gzip);
});

test('should use gzip options', t => {
    const task = new ArtifactTask(createArtifact({ tar: true, gzip: true }), { tar: true, gzip: { level: 10 } });

    t.true(task.settings.gzip);
    t.deepEqual(task.settings.gzipOptions, { level: 10 });
});

test('should override dotFiles setting', t => {
    const task = new ArtifactTask(createArtifact({ dotFiles: true }), { dotFiles: false });

    t.true(task.settings.dotFiles);
});

test('should override emptyFiles setting', t => {
    const task = new ArtifactTask(createArtifact({ emptyFiles: true }), { emptyFiles: false });

    t.true(task.settings.emptyFiles);
});

test('should override emptyDirs setting', t => {
    const task = new ArtifactTask(createArtifact({ emptyDirs: true }), { emptyDirs: false });

    t.true(task.settings.emptyDirs);
});
