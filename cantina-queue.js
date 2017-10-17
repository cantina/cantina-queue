var app = require('cantina')
  , Queue = require('bull');

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

// Instantiate the API.
app.queue = {
  _clients: {},
  _queue: null
};

// Create a new redis client (copy-pasted from cantina-redis).
function createRedisClient () {
  var opts = app.conf.get('redis') || {};

  if (typeof conf === 'string') {
    opts = { nodes: [opts] };
  }
  else if (Array.isArray(opts)) {
    opts = { nodes: opts };
  }
  else if (!opts.nodes) {
    opts.nodes = ['127.0.0.1:6379'];
  }
  if (!opts.prefix) {
    opts.prefix = 'cantina';
  }

  return app.redis.module.createClient(opts.nodes, opts);
}

// We need to provide our own redis client(s).
conf.createClient = function (type) {
  if (!app.queue._clients[type]) {
    app.queue._clients[type] = createRedisClient();
  }
  return app.queue._clients[type];
};

// Create the main queue.
app.queue._queue = new Queue(conf.name, conf);

// Queue a new job.
app.queue.add = function (queue, payload) {
  app.queue._queue(queue, payload);
};

// Process a job.
app.queue.process = function (queue, cb) {
  app.queue._queue.process(queue, cb);
};

// Load workers from a directory and register queue workers for them.
app.loadQueueWorkers = function (dir, cwd) {
  var workers = app.load(dir, cwd);
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
      app.queue.process(queue, handler);
    }
  });
};

// Load workers from app root.
app.loadQueueWorkers('workers');
