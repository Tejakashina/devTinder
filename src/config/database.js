const mongoose = require('mongoose')
const connectDB = async() => {
    await mongoose.connect('mongodb://tejasrikashina_db_user:SMREPq6jDF6EyMr7@ac-zphp90t-shard-00-00.gqnhpwz.mongodb.net:27017,ac-zphp90t-shard-00-01.gqnhpwz.mongodb.net:27017,ac-zphp90t-shard-00-02.gqnhpwz.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-d7l7i9-shard-0&authSource=admin&appName=Node/devTinder')}
module.exports = connectDB