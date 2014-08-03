cantina-queue
=============

Amino queue interface for cantina applications.

Dependencies
------------

- [cantina-amino](https://github.com/cantina/cantina-amino)
- [amino-queue](https://github.com/amino/amino-queue)
- A RabbitMQ server.

Provides
--------

- **app.loadQueueWorkers (dir, cwd)** - Loads modules in `dir` and registers them
  as queue workers. See *Usage* for more info. (Automatically loads modules in
  `<app.root>/workers` on app start).
- **app.queue (queue, payload)** - Schedule work to be done.
- **app.amino.queue** - The full amino queue API.

Usage
-----

**Expose workers in `<app.root>/workers`**

Modules in this directory will automatically be scanned and registered. Two
formats are supported. The preffered format is for the module to export its
queue key and worker function like so:

```js
module.exports = function (app) {
  return {
    queue: 'queue:key',
    worker: function (payload, cb) {
      // Do work
      cb();
    }
  };
};
```

Alternatively, your module can just export the worker function and the
basename of the module will be used as the queue key.

**Queue work to be done**

Use `app.queue()` to schedule work to be done. Work is asynchronous so you'll
need to use events or hooks if other app code needs to know when specific
work is completed.

```js
app.queue('queue:key', {my: 'payload'});
```

- - -

### Developed by [TerraEclipse](https://github.com/TerraEclipse)

Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.
