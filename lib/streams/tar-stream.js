'use strict';

const assert = require('assert');

const fs = require('graceful-fs');
const archiver = require('archiver');

const AbstractWritableStream = require('./abstract-writable-stream');

/**
 * Tarball stream.
 *
 * Stream writes tarball with files to destination file.
 *
 * Input readable stream should have object chunks with file info in vinyl format.
 *
 * @extends AbstractWritableStream
 */
module.exports = class TarStream extends AbstractWritableStream {
    /**
     * Creates tarball stream.
     *
     * @param {string}  dest                      The path to destination file.
     * @param {object}  [options]                 The options.
     * @param {boolean} [options.emptyFiles=true] Include empty files.
     * @param {boolean} [options.emptyDirs=true]  Include empty directories.
     * @param {boolean} [options.gzip=false]    Compress the tar archive using gzip. Passed to zlib to control compression.
     * @param {object}  [options.gzipOptions]     The gzip options.
     */
    constructor(dest, options) {
        super(dest, options);

        assert(dest, 'You should specify the destination path to tarrball.');

        options || (options = {});

        try {
            console.log(`I AM GONNA WRITE IN ${dest}`);
            const output = fs.createWriteStream(dest, { autoClose: true });
            const archive = archiver('tar', {
                gzip: options.gzip,
                gzipOptions: options.gzipOptions
            });

            archive.pipe(output);
            archive.on('error', err => this.emit('error', err));

            output.once('open', () => this.emit('open'));
            output.once('close', () => this.emit('close'));
            output.on('error', err => this.emit('error', err));

            this._archive = archive;
            console.log('ARCHIVE>>>>>');
            console.log(this._archive);

            this.once('finish', () => archive.finalize());
        } catch (err) {
            this.emit('error', err);
        }
    }
    /**
     * Adds directory (without its files and subdirs) to archive.
     *
     * Keeps original path relative to cwd.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} dir — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addDirectory(dir, callback) {
        this._archive.append('', {
            name: dir.relative,
            type: 'directory'
        });

        callback();
    }
    /**
     * Adds file to archive.
     *
     * Keeps original path relative to cwd.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} file — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addFile(file, callback) {
        const readable = fs.createReadStream(file.history[0], { autoClose: true })
            .on('error', callback)
            .on('end', callback);

        if (!file.path.match('node_modules')) {
            console.log('ADD >>>>>>>>');
            console.log(JSON.stringify(file, null, 4));
        }
        try {
            this._archive.append(readable, {
                name: file.relative,
                type: 'file',
                // We keep original behaviour for node-archiver (0o644 by default for files)
                // but add `x` flags for executables
                mode: 0o644 | (0o111 & file.stats.mode),
                _stats: file.stats,
                size: file.stats.size
            });
        } catch (e) {
            console.log('TARTIFACTS COULD NOT ADD@@@@');
            console.log(e);
        }
    }
    /**
     * Adds symlink to archive.
     *
     * Keeps original path relative to cwd.
     *
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats, history: string[]}} file — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addSymbolicLink(file, callback) {
        fs.readlink(file.history[0], (err, target) => {
            if (err) {
                return callback(err);
            }

            this._archive.symlink(file.relative, target);

            callback();
        });
    }
};
