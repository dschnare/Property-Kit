var pk = require('../property-kit');

describe('propertyKit locked properties', function () {
  it('should create a property with a locked setter', function () {
    var k = {};
    var id = pk({
      value: 10,
      keys: { set: k }
    });

    expect(id()).toBe(10);
    expect(function () {
      id(11)
    }).toThrowError();
    expect(id()).toBe(10);
    expect(id(12, { key: k })).toBe(undefined);
    expect(id()).toBe(12);
  });

  it('should create a property with custom getter and a locked setter', function () {
    var k = {};
    var me = {
      firstName: pk('Darren'),
      lastName: pk('Schnare'),
      fullName: pk({
        keys: { set: k },
        get: function () {
          return this.firstName() + ' ' + this.lastName();
        }
      })
    };

    expect(me.fullName()).toBe('Darren Schnare');
    expect(function () {
      me.fullName('Mike Tyson');
    }).toThrowError();
    expect(me.fullName()).toBe('Darren Schnare');
  });

  it('should create a completely locked property (i.e. both getter and setter are locked)', function () {
    var key = {};
    var o = {};
    var id = pk({value: 0, key: key});

    expect(id).toThrowError();
    expect(function () {
      id(15);
    }).toThrowError();
    expect(id(1, { key: key })).toBe(undefined);
    expect(id({ key: key })).toBe(1);
    expect(id.call(o, 2, { key: key })).toBe(o);
    expect(id({ key: key })).toBe(2);
  });

  it('should create a property with a custom getter and setter and locked setter', function () {
    var key = {};
    var me = {
      firstName: pk('Darren'),
      lastName: pk('Schnare'),
      fullName: pk({
        keys: {set: key},
        get: function () {
          return this.firstName() + ' ' + this.lastName();
        },
        set: function (oldValue, newValue) {
          var parts = (newValue + '').split(' ');

          if (parts.length === 2) {
            this.firstName(parts[0]);
            this.lastName(parts[1]);
          }
        }
      })
    };

    expect(me.fullName()).toBe('Darren Schnare');
    expect(function () {
      me.fullName('Little Jon');
    }).toThrowError();
    expect(me.fullName('Little Jon', { key: key })).toBe(me);
    expect(me.fullName()).toBe('Little Jon');
  });
});
