'use strict';

const nativeFs = require('fs');
const path = require('path');

const pify = require('pify');
const makeDir = require('make-dir');

const nativeReadlink = pify(nativeFs.readlink);
const nativeSymlink = pify(nativeFs.symlink);

/**
 * Copies symlink to destination.
 *
 * @param {string} source Path to symbolic link you want to copy.
 * @param {string} destination Where you want the symbolic link copied.
 * @param {Object} [options]
 * @param {Object} [options.fs] Use a custom fs implementation. For example `graceful-fs`.
 * @returns {Promise}
 */
module.exports = (source, destination, options) => {
    const opts = options || {};
    const destPath = path.resolve(destination);
    const destDir = path.dirname(destPath);
    const readlink = opts.fs ? pify(opts.fs.readlink) : nativeReadlink;
    const symlink = opts.fs ? pify(opts.fs.symlink) : nativeSymlink;

    return Promise.all([
        makeDir(destDir, { fs: opts.fs || nativeFs }),
        readlink(source)
    ]).then(res => {
        const target = res[1];

        return symlink(target, destination);
    });
};
