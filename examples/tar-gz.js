const tartifacts = require('../index');

tartifacts({
    dest: './dest/some-file.tar.gz',
    includes: 'fixtures/**',
    tar: true,
    gzip: { level: 1 }
}, { root: __dirname })
.then(() => console.log('Packaging completed!'))
.catch(err => console.log(err));
