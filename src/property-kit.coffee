'use strict'

noop = (v) -> v

pk = (descriptor) ->
  if descriptor.constructor isnt Object
    value = descriptor
    get = noop
    set = (value, newValue) -> newValue
    keys = {}
  else
    keys =
      get: descriptor.key or descriptor.keys?.get
      set: descriptor.key or descriptor.keys?.set

    value = descriptor.value
    get = descriptor.get or noop
    set = descriptor.set or (value, newValue) -> newValue
    computed = value is undefined

  (v, opts) ->
    opts = opts or (v if v?.key?) or {}

    if arguments.length is 0
      throw new Error('Cannot get a locked property.') if keys.get
      return value = get.call(@, value) if computed
      return get.call(@, value)
    else if arguments.length is 1
      if keys.get and opts.key
        if keys.get is opts.key
          return value = get.call(@, value) if computed
          return get.call(@, value)
        else
          throw new Error('Cannot get a locked property.')
      else if keys.set
        throw new Error('Cannot set a locked property.')
      else
        value = get.call(@, value) if computed
        value = set.call(@, value, v)
        return @
    else if arguments.length is 2
      if keys.set
        if keys.set is opts.key
          value = get.call(@, value) if computed and value is undefined
          value = set.call(@, value, v)
          return @
        else
          throw new Error('Cannot set a locked property.')
      else
        value = get.call(@, value) if computed and value is undefined
        value = set.call(@, value, v)
        return @

# Legacy API
pk.pk = pk
pk.propertyKit = pk

module.exports = pk