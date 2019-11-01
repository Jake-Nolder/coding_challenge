const dataType = {
    isString: (value) => {
      // Returns if a value is a string
      return typeof value === 'string' || value instanceof String;
    },
    isNumber: (value) => {
      // Returns if a value is really a number
      return typeof value === 'number' && value >= 0;
    },
    isBoolean: (value) => {
      // Returns if a value is boolean
      return typeof value === 'boolean';
    },
    isObject: (value) => {
      // Returns if a value is an object
      return value && typeof value === 'object' && value.constructor === Object && !(Array.isArray(value));
    },
    isArray: (value) => {
      // Returns if a value is an Array
      return Array.isArray(value);
    },
    isUndefiened: (value) => {
      // Returns if a value is undefined
      return value === undefined;
    },
    isFunction: (value) => {
      // Return if a value is a function
      return typeof value === 'function';
    },
    getType: (o) => {
      const TYPES = {
        undefined: 'isUndefined',
        number: 'isNumber',
        boolean: 'isBoolean',
        string: 'isString',
        '[object Function]': 'isFunction',
        '[object RegExp]': 'isRegexp',
        '[object Array]': 'isArray',
        '[object Date]': 'isDate',
        '[object Error]': 'isError',
      };
      const TOSTRING = Object.prototype.toString;
      return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'isObject' : 'null');
    },
  };

export default dataType;