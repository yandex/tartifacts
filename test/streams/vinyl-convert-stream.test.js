'use strict';

const path = require('path');

const test = require('ava');
const Vinyl = require('vinyl');
const streamify = require('stream-array');
const streamToArray = require('stream-to-array');

const VinylConvertStream = require('../../lib/streams').VinylConvertStream;

test('should convert object with "path,base,cwd" to vinyl format', async t => {
    const vinyls = await vinylConvert([
        {
            path: path.join('source-dir', 'another-dir', 'test.js'),
            base: path.join('source-dir', 'another-dir'),
            cwd: 'source-dir'
        }
    ]);

    t.is(vinyls[0].relative, path.join('test.js'));
    t.is(vinyls[0].base, path.join('source-dir', 'another-dir'));
    t.true(Vinyl.isVinyl(vinyls[0]));
});

function vinylConvert(files, cwd) {
    return new Promise((resolve, reject) => {
        const stream = streamify(files)
            .on('error', reject)
            .pipe(new VinylConvertStream(cwd))
            .on('error', reject);


        streamToArray(stream)
            .then((parts) => resolve(parts));
    });
}
