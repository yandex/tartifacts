'use strict';

const test = require('ava');

const ArtifactTask = require('../../../lib/artifacts').ArtifactTask;

test('should create artifact with specified root', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root: '/root' });

    t.is(task.artifact.root, '/root');
});

test('should create artifact with specified name', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root: '/root' });

    t.is(task.artifact.name, 'tartifact');
});

test('should build path of artifact by name', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: ['lib/**'], root: '/root' });

    t.is(task.artifact.path, '/root/tartifact');
});

test('should build path by relative dest', t => {
    const task = new ArtifactTask({ dest: '../tartifact', patterns: ['lib/**'], root: '/root' });

    t.is(task.artifact.path, '/tartifact');
});

test('should build path by absolute dest', t => {
    const task = new ArtifactTask({ dest: '/tartifact', patterns: ['lib/**'], root: '/root' });

    t.is(task.artifact.path, '/tartifact');
});

test('should build patterns', t => {
    const task = new ArtifactTask({ name: 'tartifact', patterns: 'lib/**', includes: ['test/**'], excludes: ['exlib/**'] });

    t.deepEqual(task.artifact.patterns, ['lib/**', 'test/**', '!exlib/**']);
});
