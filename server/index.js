const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors()) 
app.use(express.json())


//routes
// const router = require('./routes/routes')
// app.use('/',router)

//server for handling REST routes is set to 4000
app.listen(5000, ()=>{
  console.log('PORT route is running in 5000')
})

//database
// const database = require('./database/database')



//socket config
const socket = require('./socket/socket')
socket() 