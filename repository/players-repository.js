const MongoClient = require('mongodb').MongoClient;
var dotenv = require('dotenv');
dotenv.config()

const uri = process.env.DATABASE_URI
const db_name = process.env.DATABASE_NAME
const collection_name = 'players'

var connect = async () => {
    console.log('Connecting to database: ', uri)
    return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log('Connection error: ', err)
    })
}

var create_player = async (player) => {
    var player
    client = await connect()
    if (!client) {
        return player
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        player = await collection.insertOne(player)
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return player
}

var get_player = async (id) => {
    let player_id = parseInt(id, 10)
    var player
    client = await connect()
    if (!client) {
        return player
    }
    try {
        const db = client.db(db_name)
        let collection = db.collection(collection_name)
        player = await collection.findOne({id: player_id})
        if (typeof player === 'undefined' && !player){
            throw new NotFoundError(`Not Found by id ${id}`)
        }
    } catch (err) {
        throw err
    } finally {
        client.close()
    }
    return player
}

module.exports = {
    create_player: create_player, 
    get_player: get_player
}