'use strict';

const path = require('path');

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

const root = path.resolve('/root');

test('should create artifact with absolute root', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(task.artifact.root, path.resolve('/root'));
});

test('should create artifact with relative root', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root: './root' });

    t.is(task.artifact.root, path.join(process.cwd(), './root'));
});

test('should create artifact with specified name', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(task.artifact.name, 'tartifact');
});

test('should build path of artifact by name', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/root/tartifact'));
});

test('should build path by relative dest', t => {
    const task = new ArtifactTask({ dest: '../tartifact', patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/tartifact'));
});

test('should build path by absolute dest', t => {
    const task = new ArtifactTask({ dest: path.resolve('/tartifact'), patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/tartifact'));
});

test('should build path of artifact by name and relative dest dir', t => {
    const task = new ArtifactTask({ name: 'tartifact', destDir: 'dest', patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/root/dest/tartifact'));
});

test('should build path of artifact by name and absolute dest dir', t => {
    const task = new ArtifactTask({ name: 'tartifact', destDir: path.resolve('/dest'), patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/dest/tartifact'));
});

test('should build path by relative dest and dest dir', t => {
    const task = new ArtifactTask({ dest: '../tartifact', destDir: 'dest', patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/root/tartifact'));
});

test('should build path by absolute dest and dest dir', t => {
    const task = new ArtifactTask({ dest: path.resolve('/tartifact'), destDir: 'dest', patterns: ['lib/**'], root });

    t.is(task.artifact.path, path.resolve('/tartifact'));
});

test('should build patterns', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: 'lib/**', includes: ['test/**'], excludes: ['exlib/**'] });

    t.deepEqual(task.artifact.patterns, ['lib/**', 'test/**', '!exlib/**']);
});
