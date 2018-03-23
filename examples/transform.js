'use strict';

const path = require('path');

const tartifacts = require('../index');

const transform = (chunk) => {
    const f = path.parse(chunk.path);

    if (f.ext === '.txt') {
        chunk.path = path.join(f.dir, 'dir', f.base);
    }

    return chunk;
};

tartifacts({
    dest: './dest/some-file.tar.gz',
    includes: 'fixtures/**',
    tar: true,
    gzip: { level: 1 },
    transform
}, { root: __dirname })
.then(() => console.log('Packaging completed!'))
.catch(console.error);
