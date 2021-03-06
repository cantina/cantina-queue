var queue = require('amino-queue');

module.exports = function (app) {
  // Depends on cantina amino.
  app.require('cantina-amino');

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
  // Workers do not start processing until app start.
  app.loader('workers', function (options) {
    app.hook('start').add(function (done) {
      var workers = app.load('modules', options);
      Object.keys(workers).forEach(function (name) {
        var worker = workers[name]
          , queue = (worker && worker.queue) || name
          , handler = (worker && worker.worker) || worker
          , count = (worker && worker.count) || 1
          , i;

        if (typeof handler !== 'function') {
          // The module is registering its own worker(s).
          return;
        }

        for (i = 0; i < count; i++) {
          app.amino.process(queue, handler);
        }
      });
      process.nextTick(done);
    });
  });
};
