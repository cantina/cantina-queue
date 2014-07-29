module.exports = function (app) {
  app.amino.process('manual', function (payload, cb) {
    assert.equal(payload.name, 'thomas');
    app.emit('manual');
    cb();
  });
};