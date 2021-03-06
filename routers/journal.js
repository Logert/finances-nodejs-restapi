const express = require('express');
const { ObjectID } = require('mongodb');
const { validationResult } = require('express-validator/check');
const journalSchema = require('../schemas/journal');

const router = express.Router();
const errorFormatter = ({ msg, param }) => ({ [param]: msg });

router.get('/', (req, res, next) => {
  req.app.locals.db.collection('journal').find({}).toArray((err, docs) => {
    if (err) {
      next(new Error(err.message));
    } else res.status(200).json(docs.map(item => item));
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    const { db } = req.app.locals;
    const id = new ObjectID(req.params.id);
    const journal = await db.collection('journal').findOne({ _id: id });
    if (journal) {
      res.status(200).json(journal);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', journalSchema, (req, res, next) => {
  try {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    } else {
      res.json(req.body);
    }
  } catch (err) {
    next(err);
  }
  // const { body } = req;
  // req.app.locals.db.collection('journal').insertOne(body, (err, result) => {
  //   if (err) {
  //     next(new Error(err.message));
  //   } else {
  //     console.log(result);
  //   }
  // });
});

module.exports = router;
