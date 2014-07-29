module.exports = function (app) {
  return {
    queue: 'custom',
    worker: function (payload, cb) {
      assert.equal(payload.name, 'link');
      app.emit('withexports');
      cb();
    }
  };
};