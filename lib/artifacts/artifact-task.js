'use strict';

const path = require('path');
const assert = require('assert');

const composePatterns = require('../patterns').compose;

const cwd = process.cwd();
const defaultSettings = {
    tar: false,
    gzip: false,
    gzipOptions: { level: 1 },

    dotFiles: true,
    emptyFiles: true,
    emptyDirs: true
};
const settingsNames = Object.keys(defaultSettings);

/**
 * Returns settings of artifact.
 *
 * @param {object} artifact The artifact info.
 * @returns {{tar: boolean, gzip: boolean, gzipOptions: Object, dotFiles: boolean, emptyFiles: boolean, emptyDirs: boolean }}
 */
const getArtifactSettings = (artifact) => {
    const settings = {};

    settingsNames.forEach(settingName => {
        if (artifact.hasOwnProperty(settingName)) {
            settings[settingName] = artifact[settingName];
        }
    });

    return settings;
};

/**
 * Task contains info about artifact (name, files that need include to artifact, etc)
 * and settings to write artifact.
 */
module.exports = class ArtifactTask {
    /**
     * Creates artifact task instance.
     *
     * @param {object}   artifact              The artifact info.
     * @param {string}   [artifact.root='cwd'] The path to artifact root directory. By default is cwd.
     * @param {string}   [artifact.dest]       The path to destination file or directory.
     * @param {string}   [artifact.name]       The name of destination file or directory.
     * @param {string[]} [artifact.patterns]   The glob patterns to files which need to be included or excluded.
     *                                         To exclude files use negative patterns.
     * @param {string[]} [artifact.includes]   The glob patterns to files which need to be included.
     * @param {string[]} [artifact.excluded]   The glob patterns to files which need to be excluded.
     * @param {object}   [settings]                 The artifact options.
     * @param {boolean}  [settings.tar]             If `true`, destination directory will be packed to tarball file.
     *                                              Otherwise files of artifact will be copied to destination directory.
     *                                              If `true`, tarball file will be gzipped.
     * @param {boolean|Object}  [settings.gzip]     Gzip destination tarball file.
     * @param {boolean}  [settings.dotFiles=true]   Include dotfiles.
     * @param {boolean}  [settings.emptyFiles=true] Include empty files.
     * @param {boolean}  [settings.emptyDirs=true]  Include empty directories.
     */
    constructor(artifact, settings) {
        artifact || (artifact = {});
        settings || (settings = {});

        const dest = artifact.dest || artifact.name;
        assert(dest, 'you should specify the dest path for artifact.');

        const root = artifact.root || settings.root || cwd;
        const destPath = path.isAbsolute(dest) ? dest : path.join(root, dest);
        const name = path.basename(destPath);
        this._artifact = {
            root,
            name,
            path: destPath,
            patterns: composePatterns(artifact.patterns, {
                include: artifact.includes,
                exclude: artifact.excludes
            })
        };

        const artifactSettings = getArtifactSettings(artifact);
        const gzip = artifact.gzip === 'object' && artifact.gzip || settings.gzip || artifact.gzip || defaultSettings.gzip;
        const gzipOptions = typeof gzip === 'object' ? gzip : defaultSettings.gzipOptions;
        this._settings = Object.assign({}, defaultSettings, settings, artifactSettings, { gzipOptions });
        this._settings.gzip = Boolean(this._settings.gzip);

        if (!this._settings.tar && this._settings.gzip) {
            throw new Error('it is impossible to create not archive artifact with gzip. You should turn on the tar setting.');
        }
    }

    /**
     * Returns artifact info.
     *
     * @returns {{root: string, path: string, name: string, patterns: string[]}}
     */
    get artifact() {
        return this._artifact;
    }

    /**
     * Returns artifact settings.
     *
     * @returns {{isTar: boolean, isGzip: boolean, gzipOptions: Object, dotFiles: boolean, emptyFiles: boolean, emptyDirs: boolean }}
     */
    get settings() {
        return this._settings;
    }
};
