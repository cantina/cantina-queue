var app = require('cantina');

module.exports = {
  queue: 'custom',
  worker: function (payload, cb) {
    assert.equal(payload.name, 'link');
    app.emit('withexports');
    cb();
  }
};