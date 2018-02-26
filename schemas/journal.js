const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  date: {
    exists: {
      errorMessage: 'Date is required',
    },
  },
  sum: {
    isFloat: {},
    exists: {},
  },
  'bill.name': {
    exists: {},
  },
  'bill.subName': {
    exists: {},
  },
  'category.name': {
    exists: {},
  },
  'category.subName': {
    exists: {},
  },
  'category.icon': {
    exists: {},
  },
  description: {},
  operation: {
    exists: {},
    isIn: {
      options: [['+', '-', '=']],
    },
  },
});
