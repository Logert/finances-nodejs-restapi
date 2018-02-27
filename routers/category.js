const express = require('express');
const { ObjectID } = require('mongodb');
const { validationResult } = require('express-validator/check');
const categorySchema = require('../schemas/category');
const subCategorySchema = require('../schemas/subCategory');

const router = express.Router();
const errorFormatter = ({ msg, param }) => ({ [param]: msg });

router.get('/', (req, res, next) => {
  req.app.locals.db.collection('category').find({}).toArray((err, docs) => {
    if (err) {
      next(new Error(err.message));
    } else res.status(200).json(docs.map(item => item));
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    const { db } = req.app.locals;
    const id = new ObjectID(req.params.id);
    const category = await db.collection('category').findOne({ _id: id });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', categorySchema, (req, res, next) => {
  try {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    } else {
      req.app.locals.db.collection('category').insertOne(req.body, (err) => {
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

router.put('/:id', categorySchema, (req, res, next) => {
  try {
    const result = validationResult(req).formatWith(errorFormatter);
    const id = new ObjectID(req.params.id);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    } else {
      req.app.locals.db.collection('category').updateOne({ _id: id }, { $set: req.body }, (err) => {
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

router.post('/:id/sub', subCategorySchema, (req, res, next) => {
  try {
    const result = validationResult(req).formatWith(errorFormatter);
    const id = new ObjectID(req.params.id);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    } else {
      req.app.locals.db.collection('category').updateOne({ _id: id }, { $push: { sub: { _id: new ObjectID(), ...req.body } } }, (err) => {
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
    req.app.locals.db.collection('category').deleteOne({ _id: id }, (err) => {
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

router.delete('/:id/sub/:idSub', (req, res, next) => {
  try {
    const id = new ObjectID(req.params.id);
    const idSub = new ObjectID(req.params.idSub);
    req.app.locals.db.collection('category').updateOne({ _id: id }, { $pull: { sub: { _id: idSub } } }, (err) => {
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
