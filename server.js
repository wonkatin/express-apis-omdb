// required packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require('rowdy-logger')
const axios = require('axios')

// configure enviromental variables
require('dotenv').config()
const OMDB_API_KEY = process.env.OMDB_API_KEY

// configure express app
const app = express()
const PORT = 3000
// (╯°□°）╯︵ ┻━┻
const rowdyResults = rowdy.begin(app)

// Middlewares
// Sets EJS as the view engine
app.set('view engine', 'ejs')
// Specifies the location of the static assets folder
app.use(express.static('static'))
// Enables EJS Layouts middleware
app.use(ejsLayouts)
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }))
// Adds some logging to each request
app.use(require('morgan')('dev'))

// Routes
app.get('/', async (req, res) => {
  const results = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${req.query.search}`)
  res.json({ movieData: results.data })
})

// The app.listen function returns a server handle
var server = app.listen(PORT, () => {
  console.log(`listening on PORT:${PORT}`)
  rowdyResults.print()
})

