Property-Kit
===============

Property Kit is a simple, convenient and EcmaScript 3 compliant property construction API for JavaScript.

Supports Nodejs, Bower, AMD and loading as a global browser `<script>`.

## Install

    bower install property-kit

Or

    npm install property-kit

## Example usage

    // Create a property.
    var age = propertyKit(45);

    age(); // 45
    age(35);
    age(); // 35

    // Create a property that has a custom setter.
    // Setters are functions that are called when a property
    // is being set and accept the current value and the 
    // new value and must return the result that will be the new
    // value of the property.
    //
    // For this shape property we check to see if the value being set
    // is supported by checking if it exists in a list of supported enumerations.
    var shape = propertyKit({
      value: 'none', 
      set: function (oldValue, newValue) {
        return ['none', 'square', 'circle', 'rectangle'].indexOf(newValue) >= 0 ? newValue : oldValue;
      }
    });

    shape(); // 'none'
    shape('circle');
    shape(); // 'circle'
    shape('quad');
    shape(); // 'circle'

    // ------------

    // Create a property with a custom getter and setter.
    // Getters are functions that are called when a property is being accessed
    // and accept the current value of the property and must return the value to
    // to be retrieved.
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit({
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

    me.fullName(); // 'Darren Schanre'
    me.firstName('John'); 
    me.fullName(); // 'John Schnare'
    me.fullName('Max Schnare');
    me.fullName(); // 'Max Schnare'

    // ------------

    // Create a property with a locked setter.
    // Properties with locked setters can only be set by
    // objects that know what key was used to lock the property.
    //
    // In this example we don't save a reference to the key we used
    // to lock the setter so in effect we've made a read-only property.
    var id = propertyKit({
      value: 10,
      keys: { set: {} }
    };

    id(); // 10
    id(11); // Error

    // ------------

    // Create a property with a custom getter and a locked setter.
    //
    // In this example we create a computed property and lock its setter.
    // We don't save a reference to the key so this is a read-only property.
    // Properties are computed when no "value" is specified.
    var me = {
      firstName: propertyKit('Darren'),
      lastName: propertyKit('Schnare'),
      fullName: propertyKit({
        keys: { set: {} },
        get: function () {
          return this.firstName() + ' ' + this.lastName();
        }
      })
    };

    me.fullName(); // 'Darren Schnare'
    me.fullName('Mike Tyson'); // Error

    // ------------

    // Create a property with a locked setter and use the key to change its value.
    //
    // Here we create a property like we've done before, locking its setter but this
    // time we save a reference to the key used to lock it. We can then use this key
    // privately in our scope to change the property's value.
    var key = {};
    var id = propertyKit({
      value: 0,
      keys: { set: key }
    });

    id(); // 0
    id(15); // Error()
    id(1, {key: key});
    id(); // 1

    // ------------

    // Create a property with a locked setter and a custom setter.
    // 
    // Locked properties can still have custom getters and setters.
    var key = {};
    var id2 = propertyKit({
      value: 0, 
      keys: { set: key },
      set: function (oldValue, newValue) {
        newValue = parseInt(newValue, 10);

        if (newValue < 0 || isNaN(newValue)) {
          newValue = 0;
        }

        return newValue;
      }
    });

    id2(); // 0
    id2(15); // Error
    id2(25, {key: key});
    id2(); //25
    id2(-1, {key: key});
    id2(); // 0

    // --------------

    // Create a completely locked property, making it behave like a private property.
    var Model = (function () {
        var key = {};

        function Model(id) {
          this.id = propertyKit({value: id, key: { set: key }});
          this.myPrivateProperty = propertyKit({value: 'this is so private', key: key});
          // You can use either "key" or "keys.get" and "keys.set" to lock both getter and setters or a getter and setter individually.
          this.thisIsAlsoPrivate = propertyKit({value: 'this is so private', keys: { get: key, set: key}});

          this.myPrivateProperty({key: key}); // 'this is so private'
        }

        return Model;
    }());

    var model = new Model(10);
    model.id(); // 10
    model.myPrivateProperty(); // Error
    model.myPrivateProperty('some value'); // Error
    model.thisIsAlsoPrivate('some value'); // Error

## Reference

    propertyKit(value)
    propertyKit(descriptor)

    // All descriptor properties are optional.

    descriptor.value = "The initial value of the property. If not specified then the initial value is computed by calling get when the property is set for the first time (if get hasn't already been called)."
    descriptor.get = "A custom getter function. Getter functions have the following signature: get(currentValue). These functions must return the value to be retrieved from the property.
    descriptor.set = "A custom setter function. Setter functions have the following signature: set(currentValue, newValue). These functions must return the value to set the property to.
    descriptor.key = "The key used to lock both the set and get action of a property."
    descriptor.keys.get = "The key used to lock only the get action of a property."
    descriptor.keys.set = "The key used to lock only the set actoin of a property."
