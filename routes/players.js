var express = require('express');
var router = express.Router();
var repository = require('../repository/players-repository');

router.post('/',
    async (req, res) => {
        await repository.create_player(req.body)
        res.json({
            status: 201,
            message: "created",
            response: req.body
        });
    }
  )
  
  router.route('/:id').get(
    async (req, res) => {
        let player = await repository.get_player(req.params.id)
      res.json({
        status: 200,
        message: "success",
        response: player
      });
    }
  )
  
  module.exports = router;