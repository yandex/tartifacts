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
const tartifacts = require('tartifacts');

const artifacts = [
    {
        name: 'artifact.tar.gz',
        includes: 'sources/**',
        excludes: 'sources/exlib/**'
        tar: true,
        gzip: { level: 1 }
    },
    {
        name: 'artifact-dir',
        includes: 'sources/**',
        excludes: 'sources/exlib/**'
    },
    {
        name: 'artifact-dir',
        patterns: [
            'sources/**',
            '!sources/exlib/**'
        ],
        dotFiles: false // override general options
    }
];

tartifacts(artifacts, {
    root: __dirname,  // `process.cwd()` by default
    dotFiles: true,   // include dotfiles
    emptyFiles: true  // include empty files,
    emptyDirs: false  // include empty directories
})
.then(() => console.log('Copying and packaging of artifacts completed!'))
.catch(console.error);
```

CLI
---

```
Usage
  $ tartifacts

Options
  -i, --include   Paths to inlcude files
  -e, --exclude   Paths to exclude files
  -p, --patterns  Path to file with include and exclude patterns
  -d, --dest      Path to destination file
  -r, --root      Path to root directory

Examples
  $ tartifacts --include="lib/**" --exclude="node_modules/" --dest="artifact.tar.gz"
  $ tartifacts --patterns="./path/to/patterns" --dest="artifact.tar.gz"
```

Patterns
--------

You can write patterns to file.

Use `!` prefix for exclude and `#` for comments.

**Example:**

```
# include `sources`
sources/**

# exclude `sources/exlib`
!sources/exlib/*.{js,css}

# override previous exclude pattern,
# and include files with `es6.js` extension
sources/exlib/*.{es6.js}
```

Read more about patterns in [glob](https://github.com/isaacs/node-glob#glob-primer) package.

API
---

### tartifacts(artifacts, [options])

Creates artifacts and writes them to fs.

### artifacts

Type: `object[]`

The info about artifacts.

Each artifact object has the following fields.

#### artifact.name

Type: `string`

The artifact name of file or directory.

#### artifact.root

Type: `string`
Default: `precess.cwd()`

The path to root directory.

The `dest`, `name` and `patterns` will be built from root.

#### artifact.patterns

Type: `string[]`
Default: `[]`

The paths to files which need to be included or excluded.

Read more about it in [patterns](#patterns) section.

#### artifact.includes

Type: `string[]`
Default: `[]`

The paths to files which need to be included.

#### artifact.excludes

Type: `string[]`
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

#### artifact.root

Type: `string`
Default: `precess.cwd()`

The path to root directory.

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

### options

Type: `object`

Allows you to configure settings for write artifacts.

The options specify general settings for all artifacts:

 * [root](#artifactroot)
 * [tar](#artifacttar)
 * [gzip](#artifactgzip)
 * [dotFiles](#artifactdotfiles)
 * [emptyFiles](#artifactemptyfiles)
 * [emptyDirs](#artifactemptydirs)

License
-------

MIT © [Andrew Abramov](https://github.com/blond)
