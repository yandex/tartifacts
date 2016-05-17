const tartifacts = require('../index');

tartifacts({
    dest: './dest/some-dir',
    includes: 'fixtures/**'
}, { root: __dirname })
.then(() => console.log('Copying completed!'))
.catch(err => console.log(err));
