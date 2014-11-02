'use strict';
var noop, pk;

noop = function(v) {
  return v;
};

pk = function(descriptor) {
  var computed, get, keys, set, value, _ref, _ref1;
  if (descriptor.constructor !== Object) {
    value = descriptor;
    get = noop;
    set = function(value, newValue) {
      return newValue;
    };
    keys = {};
  } else {
    keys = {
      get: descriptor.key || ((_ref = descriptor.keys) != null ? _ref.get : void 0),
      set: descriptor.key || ((_ref1 = descriptor.keys) != null ? _ref1.set : void 0)
    };
    value = descriptor.value;
    get = descriptor.get || noop;
    set = descriptor.set || function(value, newValue) {
      return newValue;
    };
    computed = value === void 0;
  }
  return function(v, opts) {
    opts = opts || ((v != null ? v.key : void 0) != null ? v : void 0) || {};
    if (arguments.length === 0) {
      if (keys.get) {
        throw new Error('Cannot get a locked property.');
      }
      if (computed) {
        return value = get.call(this, value);
      }
      return get.call(this, value);
    } else if (arguments.length === 1) {
      if (keys.get && opts.key) {
        if (keys.get === opts.key) {
          if (computed) {
            return value = get.call(this, value);
          }
          return get.call(this, value);
        } else {
          throw new Error('Cannot get a locked property.');
        }
      } else if (keys.set) {
        throw new Error('Cannot set a locked property.');
      } else {
        if (computed) {
          value = get.call(this, value);
        }
        value = set.call(this, value, v);
        return this;
      }
    } else if (arguments.length === 2) {
      if (keys.set) {
        if (keys.set === opts.key) {
          if (computed && value === void 0) {
            value = get.call(this, value);
          }
          value = set.call(this, value, v);
          return this;
        } else {
          throw new Error('Cannot set a locked property.');
        }
      } else {
        if (computed && value === void 0) {
          value = get.call(this, value);
        }
        value = set.call(this, value, v);
        return this;
      }
    }
  };
};

pk.pk = pk;

pk.propertyKit = pk;

module.exports = pk;
