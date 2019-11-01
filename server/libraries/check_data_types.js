/* eslint-disable arrow-body-style */
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
      undefined: 'undefined',
      number: 'number',
      boolean: 'boolean',
      string: 'string',
      '[object Function]': 'function',
      '[object RegExp]': 'regexp',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object Error]': 'error',
    };
    const TOSTRING = Object.prototype.toString;
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
  },
};

module.exports = dataType;
