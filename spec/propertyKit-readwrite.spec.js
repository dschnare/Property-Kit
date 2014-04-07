describe('propertyKit.readwrite', function () {
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

  it('should have the alias pk and propertyKit must be callable', function () {
    expect(window.propertyKit).toBeCallable();
    expect(window.propertyKit).toBe(window.pk);
    expect(window.propertyKit).toBe(window.propertyKit.readwrite);
  });

  it('should create a simple readwrite property', function () {
    var age = propertyKit.readwrite(45);
    var o = {};

    expect(age()).toEqual(45);
    expect(age(35)).toBe(undefined);
    expect(age()).toEqual(35);
    expect(age.call(o, 10)).toBe(o);
    expect(age()).toEqual(10);
  });

  it('should create filtered readwrite properties', function () {
    var o = {};
    var shape = propertyKit.readwrite('none', function (newValue, oldValue) {
      return ['none', 'square', 'circle', 'rectangle'].indexOf(newValue) >= 0 ? newValue : oldValue;
    });

    expect(shape()).toBe('none');
    expect(shape('circle')).toBe(undefined);
    expect(shape()).toBe('circle');
    expect(shape.call(o, 'quad')).toBe(o);
    expect(shape()).toBe('circle');
  });

  it('should create readwrite properties from propertyKit()', function () {
    var name = propertyKit('Darren');
    var o = {};

    expect(name()).toBe('Darren');
    expect(name('Chris')).toBe(undefined);
    expect(name()).toBe('Chris');
    expect(name.call(o, 'Tim')).toBe(o);
    expect(name()).toBe('Tim');
  });

  it('should create a readwrite property with custom getter and setter', function () {
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit(function () {
        return this.firstName() + ' ' + this.lastName();
      }, function (newValue, oldValue) {
        var parts = (newValue + '').split(' ');

        if (parts.length === 2) {
          this.firstName(parts[0]);
          this.lastName(parts[1]);
        }
      })
    };

    expect(me.fullName()).toBe('Darren Schnare');
    expect(me.firstName('John')).toBe(me);
    expect(me.fullName()).toBe('John Schnare');
    expect(me.fullName('Max Schnare')).toBe(me);
    expect(me.fullName()).toBe('Max Schnare');
  });
});