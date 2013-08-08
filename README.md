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
module.exports = {
  queue: 'queue:key',
  worker: function (payload, cb) {
    // Do work
    cb();
  }
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

- - -

### License: MIT
Copyright (C) 2013 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
