var express = require('express');
var router = express.Router();
var repository = require('../repository/boards-repository');

router.get('/',
  async (req, res) => {
    try {
      var boards = await repository.get_boards()
      res.json({
        status: 200,
        message: 'success',
        response: boards  
      });
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }
})

router.route('/:id').get(
  async (req, res) => {
    let board_id = req.params.id
    var board = await repository.get_board(board_id)
    try {
      res.json({
        status: 200,
        message: 'success',
        response: board
      }); 
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }       
})

router.route('/:player').post(
  async (req, res) => {
    try {
      let player = req.params.player
      let board = await repository.create_board(player)
      res.json({
        status: 201,
        message: "created",
        response: board
      });
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message
      })
    }
})

router.route('/move').put(
  async (req, res) => {
    try {
      let board = await repository.make_move(req.body)
      res.json({
        status: 200,
        message: "moved",
        response: board
      });
    } catch (error) {
      res.json({
        status: error.code,
        message: error.message 
      })
    }
})

module.exports = router;
