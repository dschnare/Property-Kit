(function (global) {
  'use strict';

  function passthru(v) {
    return v;
  }

  // propertyKit(value)
  // propertyKit(value, filter)
  // propertyKit(getter, setter)
  function propertyKit(value, filter) {
    if (typeof value === 'function' && typeof filter !== 'function') {
      throw new Error('Cannot specify a custom getter with a custom setter.');
    }

    filter = typeof filter === 'function' ? filter : passthru;

    return function (v) {
      if (arguments.length) {
        if (typeof value === 'function') {
          filter.call(this, v, value.call(this));
        } else {
          value = filter.call(this, v, value);
        }

        return this;
      } else {
        return typeof value === 'function' ? value.call(this) : value;
      }
    };
  }

  // readwrite(value)
  // readwrite(value, filter)
  // readwrite(getter, setter)
  propertyKit.readwrite = propertyKit;

  // readony(value)
  // readony(getter)
  // readony(value, key)
  // readony(value, filter, key)
  // readony(getter, setter, key)
  propertyKit.readonly = function (value, filter, key) {
    var property;

    if (arguments.length === 2) {
      key = filter;
      filter = null;
    }

    // Define the filter so that it looks like a custom getter and setter
    // we are passing into propertyKit(). It's ok to do this because the
    // setter will never be called.
    if (!key && typeof value === 'function' && typeof filter !== 'function') {
      filter = passthru;
    }

    property = propertyKit(value, filter);

    return function (v, k) {
      if (arguments.length === 1) {
        throw new Error('Cannot set a readonly property.');
      } else if (arguments.length === 2 && key) {
        if (k === key) {
          property.call(this, v);
          return this;
        } else {
          throw new Error('Cannot set a readonly property.');
        }
      } else {
        return property.call(this);
      }
    };
  };

  if (typeof exports === 'object' && exports) {
    exports.pk = propertyKit;
    exports.propertyKit = propertyKit;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return {pk: propertyKit, propertyKit: cpropertyKitk};
    });
  } else {
    global.pk = propertyKit;
    global.propertyKit = propertyKit;
  }
}(this));