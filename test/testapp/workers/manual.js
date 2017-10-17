var app = require('cantina');

app.queue.process('manual', function (payload, cb) {
  assert.equal(payload.name, 'thomas');
  app.emit('manual');
  cb();
});