'use strict';

module.exports = {
    root: process.cwd(),
    destDir: '.',

    tar: false,
    gzip: false,
    gzipOptions: { level: 1 },

    followSymlinks: false,
    dotFiles: true,
    emptyFiles: true,
    emptyDirs: true,

    transform: null,

    watch: false
};
