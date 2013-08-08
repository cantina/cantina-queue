var app = require('cantina');
module.exports = function (payload, cb) {
  assert.equal(payload.name, 'brian');
  app.emit('noexports');
  cb();
};