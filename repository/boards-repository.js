const MongoClient = require('mongodb').MongoClient;
var players = require('./players-repository')
var dotenv = require('dotenv');
dotenv.config()

const uri = process.env.DATABASE_URI
const db_name = 'tic-tac-toe'
const collection_name = 'boards'

var connect = async () => {
    console.log('Connecting to database: ', uri)
    return MongoClient.connect(uri, { useNewUrlParser: true })
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
        console.log(err)
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
    } catch (err) {
        console.log(err)
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
        console.log(err)
    } finally {
        client.close()
    }
    return board
}

var make_move = async (move) => {
    var board = await get_board(move.board)
    var player = await players.get_player(move.player)
    client = await connect()
    if (!client) {
        return board
    }
    try {
        var letter = "X"
        var moves = board.table_board
        var index = parseInt(move.move, 10)
        var space = moves[index]
        if (board.player_2 == player.id){
            letter = "O"
        }
        if (space == ""){
            moves[index] = letter
        }
        update = {
			"table_board": moves
        }
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = await collection.updateOne({id: board.id}, {$set: update})
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
    return board
}


module.exports = {
    get_boards: get_boards,
    get_board: get_board, 
    create_board: create_board,
    make_move: make_move
}

