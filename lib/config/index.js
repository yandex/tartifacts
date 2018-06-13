'use strict';

const path = require('path');
const _ = require('lodash');

const composePatterns = require('../patterns').compose;
const defaults = require('./defaults');

exports.format = (artifact, settings) => {
    const options = _({}).extend(settings, artifact).defaults(defaults).value();

    const dest = options.dest || options.name;

    if (!dest) {
        throw new Error('Option "dest" or "name" must be specified for each artifact');
    }

    const root = path.resolve(options.root);
    const destDir = path.isAbsolute(options.destDir) ? options.destDir : path.join(options.root, options.destDir);
    const destPath = path.isAbsolute(dest) ? dest : path.join(destDir, dest);
    const patterns = composePatterns(options.patterns, {
        include: options.includes,
        exclude: options.excludes
    });
    const gzipOptions = typeof options.gzip === 'object' ? options.gzip : options.gzipOptions;
    const gzip = Boolean(options.gzip);

    if (!options.tar && options.gzip) {
        throw new Error('Option "gzip" must be used only with option "tar"');
    }

    if (options.transform && typeof options.transform !== 'function') {
        throw new Error('Option "transform" must be a function');
    }

    return _.extend({}, options, {root, destDir, path: destPath, patterns, gzip, gzipOptions});
};
