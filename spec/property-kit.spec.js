describe('propertyKit', function () {
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
  });

  it('should create a simple readwrite property when passing just the property value', function () {
    var age = propertyKit(45);
    var o = {};

    expect(age()).toEqual(45);
    expect(age(35)).toBe(undefined);
    expect(age()).toEqual(35);
    expect(age.call(o, 10)).toBe(o);
    expect(age()).toEqual(10);
  });

  it('should create a property with a custom setter', function () {
    var o = {};
    var shape = propertyKit({
      value: 'none', 
      set: function (oldValue, newValue) {
        return ['none', 'square', 'circle', 'rectangle'].indexOf(newValue) >= 0 ? newValue : oldValue;
      }
    });

    expect(shape()).toBe('none');
    expect(shape('circle')).toBe(undefined);
    expect(shape()).toBe('circle');
    expect(shape.call(o, 'quad')).toBe(o);
    expect(shape()).toBe('circle');
  });

  it('should create a property with custom getter and setter', function () {
    var value;
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit({
        get: function () {
          return value = this.firstName() + ' ' + this.lastName();
        }, 
        set: function (oldValue, newValue) {
          var parts = (newValue + '').split(' ');
          expect(oldValue).toBe(oldValue);

          if (parts.length === 2) {
            this.firstName(parts[0]);
            this.lastName(parts[1]);
          }
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
