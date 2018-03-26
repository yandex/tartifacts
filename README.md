tartifacts
==========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Windows Status][appveyor-img]][appveyor]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/tartifacts
[npm-img]:      https://img.shields.io/npm/v/tartifacts.svg

[travis]:       https://travis-ci.org/blond/tartifacts
[test-img]:     https://img.shields.io/travis/blond/tartifacts/master.svg?label=tests

[appveyor]:     https://ci.appveyor.com/project/blond/tartifacts
[appveyor-img]: https://img.shields.io/appveyor/ci/blond/tartifacts/master.svg?label=windows

[coveralls]:    https://coveralls.io/r/blond/tartifacts
[coverage-img]: https://img.shields.io/coveralls/blond/tartifacts/master.svg

[david]:        https://david-dm.org/blond/tartifacts
[david-img]:    https://img.shields.io/david/blond/tartifacts/master.svg


The tool to create artifacts for your assemblies.

Copy only the necessary files and pack them in `tar.gz` file.

It works much faster than removing unnecessary files and packing with command-line utility `tar`.

For example, **1 minute** vs **10 seconds** for project with 20 thousand files (80 Mb).

Install
-------

```
$ npm install --save tartifacts
```

Usage
-----

```js
const writeArtifacts = require('tartifacts');
const artifacts = [
    {
        name: 'artifact.tar.gz',
        patterns: ['sources/**', '!sources/exlib/**'],
        tar: true,
        gzip: { level: 9 }
    },
    {
        name: 'artifact-dir',
        includes: 'sources/**',
        excludes: 'sources/exlib/**',
        dotFiles: false // exclude dotfiles, override general settings
    }
];

writeArtifacts(artifacts, {
    root: './path/to/my-project/', // files of artifacts will be searched from root by artifact patterns,
                                   // for example: ./path/to/my-project/sources/**
    destDir: './dest/',
    dotFiles: true,   // include dotfiles
    emptyFiles: true  // include empty files
    emptyDirs: true   // include empty directories
})
.then(() => console.log('Copying and packaging of artifacts completed!'))
.catch(console.error);
```

API
---

### writeArtifacts(artifacts, [options])

Search files of artifact by glob patterns and writes them to artifact in fs.

### artifacts

Type: `object`, `object[]`

The info about artifacts or one artifact.

Each artifact object has the following fields:

* [name](#artifactname)
* [root](#artifactroot)
* [destDir](#artifactdestdir)
* [patterns](#artifactpatterns)
* [includes](#artifactincludes)
* [excludes](#artifactexcludes)
* [tar](#artifacttar)
* [gzip](#artifactgzip)
* [followSymlinks](#followsymlinks)
* [dotFiles](#artifactdotfiles)
* [emptyFiles](#artifactemptyfiles)
* [emptyDirs](#artifactemptydirs)
* [transform](#transform)

#### artifact.name

Type: `string`

The artifact name of file or directory.

#### artifact.root

Type: `string`

Default: `precess.cwd()`

The path to root directory.

The `patterns`, `includes` and `excludes` will be resolved from `root`.

#### artifact.destDir

Type: `string`

The path to destination directory of artifact.

The `dest` and `name` will be resolved from `destDir`. If `destDir` is not specified, `dest` and `name` will be resolved from `root`.

#### artifact.patterns

Type: `string`, `string[]`

Default: `[]`

The paths to files which need to be included or excluded.

Read more about patterns in [glob](https://github.com/isaacs/node-glob#glob-primer) package.

#### artifact.includes

Type: `string`, `string[]`

Default: `[]`

The paths to files which need to be included.

#### artifact.excludes

Type: `string`, `string[]`

Default: `[]`

The paths to files which need to be excluded.

#### artifact.tar

Type: `boolean`

Default: `false`

If `true`, destination directory will be packed to tarball file.

Otherwise files of artifact will be copied to destination directory.

#### artifact.gzip

Type: `boolean`, `object`

Default: `false`

If `true`, tarball file will be gzipped.

To change the compression level pass object with `level` field.

#### artifact.followSymlinks

Type: `boolean`

Default: `false`

Follow symlinked files and directories.

*Note that this can result in a lot of duplicate references in the presence of cyclic links.*

#### artifact.dotFiles

Type: `boolean`

Default: `true`

Include dotfiles.

#### artifact.emptyFiles

Type: `boolean`

Default: `true`

Include empty files.

#### artifact.emptyDirs

Type: `boolean`

Default: `true`

Include empty directories.

#### artifact.transform

Type: `Function`

Default: `null`

It allows you to modify files before they are archived/copied. 

Transform function has one argument with type `{path: string, relative: string, base: string, cwd: string, history: string[]}` and should return the modified chunk or array of chunks.

Note: now support only sync functions

[Example](./examples/transform.js)

### options

Type: `object`

Allows you to configure settings for write artifacts.

The options specify general settings for all artifacts:

 * [root](#artifactroot)
 * [destDir](#artifactdestdir)
 * [tar](#artifacttar)
 * [gzip](#artifactgzip)
 * [followSymlinks](#followsymlinks)
 * [dotFiles](#artifactdotfiles)
 * [emptyFiles](#artifactemptyfiles)
 * [emptyDirs](#artifactemptydirs)
 * [transform](#transform)

License
-------

MIT © [Andrew Abramov](https://github.com/blond)
