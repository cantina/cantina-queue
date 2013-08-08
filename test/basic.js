describe('basic test', function () {
  var app;

  before(function (done) {
    app = require('cantina');
    app.boot(__dirname + '/testapp', function (err) {
      if (err) return done(err);
      require('../');
      app.start(done);
    });
  });

  after(function (done) {
    app.destroy(done);
  });

  it('can run queue workers with exports', function (done) {
    app.once('withexports', done);
    app.queue('custom', {name: 'link'});
  });

  it('can run queue workers that just export the worker', function (done) {
    app.once('noexports', done);
    app.queue('noexports', {name: 'brian'});
  });
});