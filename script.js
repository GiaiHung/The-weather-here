const express = require('express')
const Datastore = require('nedb')
const app = express()
const port = process.env.PORT
app.listen(port, () => console.log("This is hosted in local server"))
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

// Create database
const database = new Datastore('database.db')
database.loadDatabase()

// Get the data from the server
app.get('/all', (request, response) => {
    database.find({}, (error, data) => {
        if(error) {
            response.end()
            return;
        }
        response.json(data)
    })
})

// Post the data from the server
app.post('/api', (request, response) => {
    const data = request.body
    const timestamp = Date.now()
    data.timestamp = timestamp
    database.insert(data)
    response.json(data)
})

// Run the variable environment to store api
require('dotenv').config()


