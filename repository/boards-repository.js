const MongoClient = require('mongodb').MongoClient;
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

var getBoards = async () => {
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

var getBoardById = async (id) => {
    let board_id = parseInt(id, 10)
    var board 
    client = await connect()
    if (!client) {
        return board
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        board = await collection.findOne({id: board_id}).then(result => {
            return result   
        })
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
    return board
}

var createBoard = async (id) => {
    var board
    client = await connect()
    var player = await getPlayer(player_id)
}


module.exports = {
    getBoards: getBoards,
    getBoardById: getBoardById, 
    createBoard: createBoard
}

