var app = require('cantina')
  , queue = require('amino-queue');

require('cantina-amino');

// Default conf.
app.conf.add({
  queue: {
    connection: {
      queue: {
        durable: true,
        autoDelete: true
      }
    }
  }
});

// Get conf.
var conf = app.conf.get('queue');

// Use queue plugin.
app.amino.use(queue, conf.connection || {});

// Expose amino queue API.
app.queue = function (queue, payload) {
  app.amino.queue(queue, payload);
};

// Register a loader for queue workers.
app.loader('workers', function (options) {
  var workers = app.load('modules', options);
  Object.keys(workers).forEach(function (name) {
    var worker = workers[name]
      , queue = worker.queue || name
      , handler = worker.worker || worker
      , count = worker.count || 1
      , i;

    if (typeof handler !== 'function') {
      // The module is registering its own worker(s).
      return;
    }

    for (i = 0; i < count; i++) {
      app.amino.process(queue, handler);
    }
  });
});
