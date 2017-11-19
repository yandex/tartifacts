'use strict';

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
     * @param {string}  dest               The path to destination file.
     * @param {object}  options            The options.
     * @param {boolean} options.emptyFiles Include empty files.
     * @param {boolean} options.emptyDirs  Include empty directories.
     * @param {object}  options.gzip       Compress the tar archive using gzip. Passed to zlib to control compression.
     */
    constructor(dest, options) {
        super(dest, options);

        options || (options = {});

        try {
            const output = fs.createWriteStream(dest, { autoClose: true });
            const archive = archiver('tar', {
                gzip: options.gzip,
                gzipOptions: typeof gzip === 'object' ? options.gzip : { level: 1 }
            });

            archive.pipe(output);
            archive.on('error', err => this.emit('error', err));

            output.once('open', () => this.emit('open'));
            output.once('close', () => this.emit('close'));
            output.on('error', err => this.emit('error', err));

            this._archive = archive;

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
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} dir — the directory info.
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
     * @param {{path: string, relative: string, base: string, cwd: string, stats: fs.Stats}} file — the directory info.
     * @param {function} callback — call this function when processing is complete.
     */
    addFile(file, callback) {
        const readable = fs.createReadStream(file.path, { autoClose: true })
            .on('error', callback)
            .on('end', callback);

        this._archive.append(readable, {
            name: file.relative,
            type: 'file',
            _stats: file.stats,
            size: file.stats.size
        });
    }
};
