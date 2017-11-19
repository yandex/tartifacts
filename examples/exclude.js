'use strict';

const tartifacts = require('../index');

tartifacts({
    dest: './dest/without-excludes',
    includes: 'fixtures/**',
    excludes: 'fixtures/file-1.txt'
}, { root: __dirname, dot: false })
.then(() => console.log('Copying completed!'))
.catch(err => console.log(err));
