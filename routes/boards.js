var express = require('express');
var router = express.Router();
var repository = require('../repository/boards-repository');

router.get('/',
  async (req, res) => {
    var boards = await repository.get_boards()
    res.json({
      status: 200,
      message: 'success',
      response: boards  
    });
})

router.route('/:id').get(
  async (req, res) => {
    let board_id = req.params.id
    var board = await repository.get_board(board_id)
    if (typeof board !== 'undefined' && board){
      res.json({
        status: 200,
        message: 'success',
        response: board
      }); 
    } else {
      res.json({
        status: 404,
        message: `Not found for id: ${board_id}` 
      })
    }    
})

router.route('/:player').post(
  async (req, res) => {
    let player = req.params.player
    let board = await repository.create_board(player)
    res.json({
      status: 201,
      message: "created",
      response: board
    });
})

router.route('/move').put(
  async (req, res) => {
    let board = await repository.make_move(req.body)
    res.json({
      status: 200,
      message: "moved",
      response: board
  });
})

module.exports = router;
