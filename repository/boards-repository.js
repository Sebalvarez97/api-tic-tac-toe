const MongoClient = require('mongodb').MongoClient;
var players = require('./players-repository')
var dotenv = require('dotenv');
const {NotFoundError, BadRequestError, InternalError, ApiError} = require('../error/api-error')
dotenv.config()

const uri = process.env.DATABASE_URI
const db_name = 'tic-tac-toe'
const collection_name = 'boards'

var connect = async () => {
    console.log('Connecting to database: ', uri)
    return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log('Connection error: ', err)
    })
}

var get_boards = async () => {
    var boards = []
    client = await connect()
    if (!client) {
        return boards
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        boards = await collection.find().toArray()
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return boards
}

var get_board = async (id) => {
    let board_id = parseInt(id, 10)
    var board 
    client = await connect()
    if (!client) {
        return board
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = await collection.findOne({id: board_id})
        if (typeof board === 'undefined' && !board){
            throw new NotFoundError(`Not Found board by id ${id}`)
        }
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return board
}

var create_board = async (id) => {
    var board
    var player = await players.get_player(id)
    client = await connect()
    if (!client) {
        return board
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = {
            "id": 01,
			"table_board": ["", "", "X", "", "X", "", "O", "", ""],
			"player_1": player.id,
			"player_2": null,
			"turn": true,
			"finished": false,
			"winner": null
        }
        await collection.insertOne(board)
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return board
}

var make_move = async (move) => {
    var board = await get_board(move.board)
    if (board.finished){
        throw new BadRequestError("Can't move, this board is finished")
    }
    var player = await players.get_player(move.player)
    client = await connect()
    if (!client) {
        return board
    }
    try {
        if ((board.turn && (player.id != board.player_1)) || (!board.turn && (player.id != board.player_2))) {
            throw new BadRequestError("It isn't your turn, can't move")
        }
        var letter = board.turn ? "X" : "O"
        var moves = board.table_board
        var index = move.move
        var space = moves[index]
        var turn = board.turn
        if (index < 0 || index > 8 || space != ""){
            throw new BadRequestError('Bad Move, Not supported')
        }
        moves[index] = letter
        var [finished, winner] = await check_winning(moves, board.player_1, board.player_2)
        update = {
            "table_board": moves,
            "turn": !turn, 
            "finished": finished,
            "winner": winner
        }
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        await collection.updateOne({id: board.id}, {$set: update})
        board = await get_board(move.board)
        if (!board.player_2 && !finished){
            letter = "O"
            var moves = board.table_board
            var index = await get_machine_move(moves)
            moves[index] = letter
            var turn = board.turn
            var finished, winner = await check_winning(moves, board.player_1, board.player_2)
            update = {
                "table_board": moves,
                "turn": !turn, 
                "finished": finished,
                "winner": winner
            }
            await collection.updateOne({id: board.id}, {$set: update})
        }
        board = await get_board(move.board)
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return board
}

const get_machine_move = async (moves) => {
    var emptyes = []
    for (let index = 0; index < moves.length; index++) {
        const element = moves[index]
        if (element == ""){
            emptyes.push(index)
        }
    }
    var random_index = Math.floor(Math.random() * emptyes.length)
    return emptyes[random_index]
}

const check_winning = async (moves, player_x, player_o) => {
    var finished = await check_board_complete(moves)
    let res = await check_match(moves)
    let winner = null
    if (res == "X") {
        finished = true
        winner = player_x
    } else if (res == "O") {
        finished = true
        winner = player_o
    }
    return [finished, winner]
}

const check_board_complete = async (moves) => {
    var flag = true;
    moves.forEach(element => {
        if (element != "X" && element != "O") {
            flag = false;
        }
    });
    return flag
}

const check_line = async (moves, a, b, c) => {
    return (
        moves[a] == moves[b] &&
        moves[b] == moves[c] &&
        (moves[a] == moves || moves[a] == moves)
    )
}

const check_match = (moves) => {
    for (i = 0; i < 9; i += 3) {
        if (check_line(moves, i, i + 1, i + 2)) {
            return moves[i];
        }
    }
    for (i = 0; i < 3; i++) {
        if (check_line(moves, i, i + 3, i + 6)) {
            return moves[i];
        }
    }
    if (check_line(moves, 0, 4, 8)) {
        return moves[0];
    }
    if (check_line(moves, 2, 4, 6)) {
        return moves[2];
    }
    return "";
};



module.exports = {
    get_boards: get_boards,
    get_board: get_board, 
    create_board: create_board,
    make_move: make_move
}

