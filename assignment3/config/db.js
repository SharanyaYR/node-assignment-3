//connect 
const mongoose = require('mongoose')
// const logger = require('../logger')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`
    MongoDB is successfully connected!
    MongoDB Connection Host: ${conn.connection.host}
    *************************************************************************`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB