var app = require('cantina')
  , Queue = require('./bull');

// Load cantina deps.
require('cantina-amino');
require('cantina-redis');

// Default conf.
app.conf.add({
  queue: {
    name: 'main',
    options: {
      prefix: app.redisKey('queue')
    }
  }
});

// Get conf.
var conf = app.conf.get('queue');

// Pull redis options and use those. We are ignoring the fact that cantina-redis
// supports multiple nodes with failover because ioredis, which bull uses,
// does not support that.
var redisConf = app.conf.get('redis');
if (redisConf) {
  if (typeof redisConf === 'string') {
    redisConf = { nodes: [redisConf] };
  }
  else if (Array.isArray(redisConf)) {
    redisConf = { nodes: redisConf };
  }
  else if (!redisConf.nodes) {
    redisConf.nodes = ['127.0.0.1:6379'];
  }
  if (!conf.options.redis && redisConf.nodes) {
    if (redisConf.nodes.length > 1) {
      throw new Error('Cannot setup cantina-queue with multiple redis nodes configured');
    }
    conf.options.redis = redisConf.nodes[0];
  }
}

// Queue a new job (also the basis for the api).
app.queue = function (name, payload) {
  app.queue._queue.add(name, payload);
};

// Create the main queue.
app.queue._queue = new Queue(conf.name, conf.options);

// Process a job.
app.queue.process = function (name, cb) {
  app.queue._queue.process(name, function (job, done) {
    cb(job.data, done);
  });
};

// Close the main queue.
app.queue.close = function () {
  return app.queue._queue.close();
};

// Side-compat with the amino-queue-based version.
if (!app.amino.queue) {
  app.amino.queue = app.queue;
  app.amino.queue._client = {};
  app.amino.queue._client.end = app.queue.close;
  app.amino.process = app.queue.process;
}

// Load workers from a directory and register queue workers for them.
app.loadQueueWorkers = function (dir, cwd) {
  var workers = app.load(dir, cwd);
  Object.keys(workers).forEach(function (name) {
    var worker = workers[name]
      , task = worker.queue || name
      , handler = worker.worker || worker;

    if (typeof handler !== 'function') {
      // The module is registering its own worker(s).
      return;
    }

    app.queue.process(task, handler);
  });
};

// Load workers from app root.
app.loadQueueWorkers('workers');
