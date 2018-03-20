'use strict';

const path = require('path');
const stream = require('stream');

const tartifacts = require('../index');

class CustomStream extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(chunk, encode, cb) {
        if (chunk.extname === '.txt') {
            chunk.dirname = path.resolve(chunk.dirname, 'new-dir');
        }

        this.push(chunk);

        cb();
    }
}

tartifacts({
    dest: './dest/some-file.tar.gz',
    includes: 'fixtures/**',
    tar: true,
    gzip: { level: 1 },
    transformStreams: [new CustomStream()]
}, { root: __dirname })
.then(() => console.log('Packaging completed!'))
.catch(err => console.log(err));
