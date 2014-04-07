describe('propertyKit.readonly', function () {
  beforeEach(function () {
    jasmine.addMatchers({
      toBeCallable: function (util, customEqualityMatchers) {
        return {
          compare: function (actual, expected) {
            var result = {};

            if (result.pass = util.equals(typeof actual, 'function', customEqualityMatchers)) {
              result.message = 'Expected ' + actual + ' to be a function';
            } else {
              result.message = 'Expected ' + actual + ' to be a function';
            }

            return result;
          }
        };
      }
    });
  });

  it('should throw if a getter and key are given without a setter', function () {
    expect(function () {
      propertyKit.readonly(function () {}, {});
    }).toThrowError();
  });

  it('should create a simple readonly property', function () {
    var id = propertyKit.readonly(10);

    expect(id()).toBe(10);
    expect(function () {
      id(11)
    }).toThrowError();
    expect(id()).toBe(10);
  });

  it('should create a readonly property with custom getter', function () {
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit.readonly(function () {
        return this.firstName() + ' ' + this.lastName();
      })
    };

    expect(me.fullName()).toBe('Darren Schnare');
    expect(function () {
      me.fullName('Mike Tyson');
    }).toThrowError();
    expect(me.fullName()).toBe('Darren Schnare');
  });

  it('should create a readonly property with a private setter', function () {
    var key = {};
    var o = {};
    var id = propertyKit.readonly(0, key);

    expect(id()).toBe(0);
    expect(function () {
      id(15);
    }).toThrowError();
    expect(id(1, key)).toBe(undefined);
    expect(id()).toBe(1);
    expect(id.call(o, 2, key)).toBe(o);
    expect(id()).toBe(2);
  });

  it('should create a readonly property with a private setter and filter', function () {
    var key2 = {};
    var o = {};
    var id2 = propertyKit.readonly(0, function (newValue, oldValue) {
      newValue = parseInt(newValue, 10);

      if (newValue < 0 || isNaN(newValue)) {
        newValue = 0;
      }

      return newValue;
    }, key2);

    expect(id2()).toBe(0);
    expect(function () {
      id2(15);
    }).toThrowError();
    expect(id2(15, key2)).toBe(undefined);
    expect(id2()).toBe(15);
    expect(id2.call(o, 25, key2)).toBe(o);
    expect(id2()).toBe(25);
    expect(id2(-1, key2)).toBe(undefined);
    expect(id2()).toBe(0);
  });

  it('should create a readonly property with a custom getter and setter and private write modifier', function () {
    var key = {};
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit.readonly(function () {
        return this.firstName() + ' ' + this.lastName();
      }, function (newValue, oldValue) {
        var parts = (newValue + '').split(' ');

        if (parts.length === 2) {
          this.firstName(parts[0]);
          this.lastName(parts[1]);
        }
      }, key)
    };

    expect(me.fullName()).toBe('Darren Schnare');
    expect(function () {
      me.fullName('Little Jon');
    }).toThrowError();
    expect(me.fullName('Little Jon', key)).toBe(me);
    expect(me.fullName()).toBe('Little Jon');
  });
});