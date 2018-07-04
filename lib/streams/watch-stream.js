'use strict';

const stream = require('stream');
const proxyquire = require('proxyquire').noCallThru();
const micromatch = require('../micromatch');

// const heapdump = require('heapdump');
// const pathOs = require('path');
const fs = require('fs');
// const dirPath = pathOs.resolve(process.cwd(), 'snapshots');
// console.log('HEAP>>>>> DIRPATH', dirPath);
// if (fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath);
// }

// setInterval(() => {
//     console.log('HEAP>>>>> MAKING SNAPSHOT', process.pid);
//     heapdump.writeSnapshot(pathOs.join(dirPath, `${process.pid}-${Date.now()}.heapsnapshot`));
// }, 20000);

const WATCHER_EVENTS = {
    add: 'add',
    addDir: 'addDir'
};

/**
 * @extends stream.Readable
 */
module.exports = class WatchStream extends stream.Readable {
    /**
     * @param {string[]} patterns
     * @param {object}   [options]
     * @param {boolean}  [options.dot=true]
     * @param {string}   [options.cwd]
     * @param {boolean}  [options.follow=false]
     * @param {boolean}  [options.nodir=false]
     */
    constructor(patterns, options) {
        console.log('TAR?????!!!/');
        console.log(process.cwd());
        console.log(JSON.stringify(patterns, null, 4));
        super({ objectMode: true });

        const micromatchOptions = { dot: options.dot };
        const cwd = this._cwd = options.cwd;

        // 'chokidar' does not provide the ability to pass 'dot' option to 'micromatch' directly,
        // so we use 'proxyquire' to monkey patch 'micromatch' in order to call all its methods with this option
        const chokidar = proxyquire('chokidar', {
            anymatch: proxyquire('anymatch', {
                micromatch: micromatch.bindOptions(micromatchOptions)
            })
        });

        const watcher = this._watcher = chokidar.watch(patterns, {
            cwd,
            followSymlinks: options.follow,
            awaitWriteFinish: {
                stabilityThreshold: 20000,
                pollInterval: 100
            }
        });
        watcher.on(WATCHER_EVENTS.add, path => this._push(path));
        options.nodir || watcher.on(WATCHER_EVENTS.addDir, path => this._push(path));
    }

    /**
     * @param {string} path
     * @returns {undefined}
     */
    _push(path) {
        if (!path.match('node_modules')) {
            console.log('TARTIFACTS push<<<<<<<<');
            console.log(path);
            // try {
            //     console.log(fs.statSync(path));
            // } catch(e) {
            //     console.log('no such file');
            //     console.log(e);
            // }
            console.log(this._cwd);
            console.log(process.cwd());
            console.log('TARTIFACTS push>>>>>>>>>');
        }

        this.push({ path, base: this._cwd, cwd: this._cwd });
    }

    /**
     * @returns {undefined}
     */
    close() {
        console.log('TARTIFACTS close>>>>>>>');
        this._watcher.close();
        this.push(null);
    }

    /**
     * Must be implemented in a child class of stream.Readable
     */
    _read() {} // eslint-disable-line class-methods-use-this
};
