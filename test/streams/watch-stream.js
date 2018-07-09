'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const {POLL_TIMEOUT, POLL_INTERVAL} = require('../../lib/constatns');
const sandbox = sinon.sandbox.create();

test.afterEach(() => {
    mockFs.restore();
    sandbox.restore();
});

const mkWatchStreamStub = (chokidarStub) => {
    const proxyquireStub = sandbox.stub();
    proxyquireStub.withArgs('chokidar').returns(chokidarStub);
    return proxyquire('../../lib/streams/watch-stream.js', {
        proxyquire: {noCallThru: () => proxyquireStub}
    });
};

test('it should wait file writing', t => {
    const chokidarStub = {watch: sandbox.stub().returns({on: sandbox.stub()})};
    const WatchStream = mkWatchStreamStub(chokidarStub);

    new WatchStream(); // eslint-disable-line no-new

    t.true(chokidarStub.watch.calledWithMatch(sandbox.match.any, {
        awaitWriteFinish: {
            stabilityThreshold: POLL_TIMEOUT,
            pollInterval: POLL_INTERVAL
        }
    }));
});
