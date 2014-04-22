(function (global, protocolKit) {
  'use strict';

  function passthru(v) {
    return v;
  }

  function noop() {}

  // Property descriptor: {value, get, set, [key, keys:{get, set}]}
  // or just the value in place of the descriptor.
  function propertyKit(descriptor) {
    var value, get, set, keys, computed;

    if (descriptor.constructor !== Object) {
      value = descriptor;
      get = function (value) { return value; };
      set = function (value, newValue) { return newValue; };
      keys = {};
    } else {
      keys = {
       get: descriptor.key || (descriptor.keys ? descriptor.keys.get : null),
       set: descriptor.key || (descriptor.keys ? descriptor.keys.set : null)
      };

      value = descriptor.value;
      get = descriptor.get || function (value) { return value; };
      set = descriptor.set || function (value, newValue) { return newValue; };
      computed = value === undefined;
    }

    // get()
    // get:locked({key})
    // set(value)
    // set:locked(value, {key})
    return function (v, opts) {
      opts = opts || (v && v.key ? v : {});

      if (arguments.length === 0) {
        if (keys.get) {
          throw new Error('Cannot get a locked property.');
        } else {
          return computed ? value = get.call(this, value) : get.call(this, value);
        }
      } else if (arguments.length === 1) {
        if (keys.get && opts.key) {
          if (keys.get === opts.key) {
            return computed ? value = get.call(this, value) : get.call(this, value);
          } else {
            throw new Error('Cannot get a locked property.');
          }
        } else if (keys.set) {
          throw new Error('Cannot set a locked property.');
        } else {
          if (computed && value === undefined) value = get.call(this, value);
          value = set.call(this, value, v);
          return this;
        }
      } else if (arguments.length === 2) {
        if (keys.set) {
          if (keys.set === opts.key) {
            if (computed && value === undefined) value = get.call(this, value);
            value = set.call(this, value, v);
            return this;
          } else {
            throw new Error('Cannot set a locked property.');
          }
        } else {
          if (computed && value === undefined) value = get.call(this, value);
          value = set.call(this, value, v);
          return this;
        }
      }
    };
  }

  if (typeof exports === 'object' && exports) {
    protocolKit = require('protocol-kit');
    exports.pk = propertyKit;
    exports.propertyKit = propertyKit;
  } else if (typeof define === 'function' && define.amd) {
    define(['protocol-kit'], function () {
      return {pk: propertyKit, propertyKit: propertyKitk};
    });
  } else {
    global.pk = propertyKit;
    global.propertyKit = propertyKit;
  }
}(this, this.protocolKit));
