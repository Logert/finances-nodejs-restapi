const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  name: {
    exists: {},
  },
});
