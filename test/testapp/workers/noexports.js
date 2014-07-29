module.exports = function (app) {
  return function noexports (payload, cb) {
    assert.equal(payload.name, 'brian');
    app.emit('noexports');
    cb();
  };
};