const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  name: {
    exists: {},
  },
  'money.*.name': {
    exists: {},
  },
  'money.*.value': {
    exists: {},
    isFloat: {},
  },
  'money.*.currency.name': {
    exists: {},
  },
});
