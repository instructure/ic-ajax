module('ic-ajax');

ic.ajax.FIXTURES = {
  '/get': {
    response: { foo: 'bar' },
    textStatus: 'success',
    jqXHR: {}
  }
};

test('presence', function() {
  ok(ic.ajax, 'ic.ajax is defined');
});

asyncTest('pulls from fixtures', function() {
  ic.ajax('/get').then(function(result) {
    start();
    deepEqual(result, ic.ajax.FIXTURES['/get']);
  });
});

asyncTest('url as only argument', function() {
  var server = fakeServer('GET', '/foo', {foo: 'bar'});
  ic.ajax('/foo').then(function(result) {
    start();
    deepEqual(result.response, {foo: 'bar'});
  });
  server.respond();
  server.restore();
});

asyncTest('settings as only argument', function() {
  var server = fakeServer('GET', '/foo', {foo: 'bar'});
  ic.ajax({url: '/foo'}).then(function(result) {
    start();
    deepEqual(result.response, {foo: 'bar'});
  });
  server.respond();
  server.restore();
});

asyncTest('url and settings arguments', function() {
  var server = fakeServer('GET', '/foo?baz=qux', {foo: 'bar'});
  ic.ajax('/foo', {data: {baz: 'qux'}}).then(function(result) {
    start();
    deepEqual(result.response, {foo: 'bar'});
  });
  server.respond();
  server.restore();
});

test('throws if success or error callbacks are used', function() {
  var k = function() {};
  throws(function() {
    ic.ajax('/foo', { success: k });
  });
  throws(function() {
    ic.ajax('/foo', { error: k });
  });
  throws(function() {
    ic.ajax('/foo', { success: k, error: k });
  });
});

function fakeServer(method, url, response) {
  var server = sinon.fakeServer.create();
  var data = {foo: 'bar'};
  server.respondWith(method, url, [
    200,
    { "Content-Type": "application/json" },
    JSON.stringify(response)
  ]);
  return server;
}

