var express = require('express');
var router = express.Router();
var repository = require('../repository/players-repository');

router.post('/',
    async (req, res) => {
        console.log(req.body)
        res.json({
            status: 201,
            message: "created",
            response: req.body
        });
    }
  )
  
  router.route('/:id').get(
    (req, res) => {
      res.json({
        status: 200,
        message: "success",
        response: {
            id: 01,
            name: "Carlitos"
        }
      });
    }
  )
  
  module.exports = router;