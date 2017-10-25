// Shims, for bull.
require('core-js/fn/string/starts-with');
require('core-js/fn/object/assign');

// Load bull. We need to mock the 'events' module because bull uses a
// breaking change from a future node version.
// Mock require('events') as an event-emitter also, for node 0.10.x compat.
var mock = require('mock-require');
var events = require('events');
var _events = events.EventEmitter;
_events.usingDomains = events.usingDomains;
_events.EventEmitter = events.EventEmitter;
mock('events', _events);
var Queue = require('bull');
mock.stop('events');

module.exports = Queue;
