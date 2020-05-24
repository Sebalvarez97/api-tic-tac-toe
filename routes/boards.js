var express = require('express');
var router = express.Router();
var repository = require('../repository/boards-repository');

router.get('/',
  async (req, res) => {
    var boards = await repository.getBoards()
    res.json({
      status: 200,
      message: 'success',
      response: boards  
    });
})

router.route('/:id').get(
  async (req, res) => {
    let board_id = req.params.id
    var board = await repository.getBoardById(board_id)
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
    var board = await 
    res.json({
      status: 201,
      message: "created"
    });
})

router.route('/move').post(
  (req, res) => {
    res.json({
      status: 200,
      message: "moved",
      response: req.body
  });
})

module.exports = router;
