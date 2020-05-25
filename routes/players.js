var express = require('express');
var router = express.Router();
var repository = require('../repository/players-repository');

router.post('/',
    async (req, res) => {
        try {
            await repository.create_player(req.body)
            res.json({
                status: 201,
                message: "created",
                response: req.body
            });
        } catch (error) {
            res.json({
                status: error.code,
                message: error.message 
              })
        }
    }
  )
  
  router.route('/:id').get(
    async (req, res) => {
        try {
            let player = await repository.get_player(req.params.id)
            res.json({
                status: 200,
                message: "success",
                response: player
            });
        } catch (error) {
            res.json({
                status: error.code,
                message: error.message 
              })  
        }
    }
  )
  
  module.exports = router;