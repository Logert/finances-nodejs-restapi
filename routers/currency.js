const express = require('express');
const { ObjectID } = require('mongodb');
const { validationResult } = require('express-validator/check');
const currencySchema = require('../schemas/currency');

const router = express.Router();
const errorFormatter = ({ msg, param }) => ({ [param]: msg });

router.get('/', (req, res, next) => {
  req.app.locals.db.collection('currency').find({}).toArray((err, docs) => {
    if (err) {
      next(new Error(err.message));
    } else res.status(200).json(docs.map(item => item));
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    const { db } = req.app.locals;
    const id = new ObjectID(req.params.id);
    const currency = await db.collection('currency').findOne({ _id: id });
    if (currency) {
      res.status(200).json(currency);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', currencySchema, (req, res, next) => {
  try {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    } else {
      req.app.locals.db.collection('currency').insertOne(req.body, (err) => {
        if (err) {
          next(new Error(err.message));
        } else {
          res.status(200).json(req.body);
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const id = new ObjectID(req.params.id);
    req.app.locals.db.collection('currency').deleteOne({ _id: id }, (err) => {
      if (err) {
        next(new Error(err.message));
      } else {
        res.status(200).json({});
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
