const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  name: {
    exists: {},
  },
  short: {
    exists: {},
    isUppercase: {},
    isLength: {
      options: { min: 3, max: 3 },
    },
  },
});
