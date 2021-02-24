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

// custom middleware to log requests
app.use((req, res, next) => {
  console.log('hello from a middleware!')
  console.log(`request method: ${req.method}`)
  console.log(`request URL: ${req.originalUrl}`)
  next()
})

const searchOmdb = async (req, res, next) => {
  try{
    const results = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${req.query.search}`)
    req.results = results
    next()
  } catch (error) {
    console.log(error)
    res.status(500).render('error.ejs')
  }
} 

// GET / - render search form
app.get('/', (req, res) => {
  res.render('index.ejs')
})

//  GET /results - render results of omdb search
app.get('/results', searchOmdb, (req, res) => {
  res.render('results', { movies: req.results.data.Search })
})

//  GET /detail/:movie_id - render detail of one movie omdb search
app.get('/detail/:movie_id', async (req, res) => {
  try {
    const results = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${req.params.movie_id}`)
    res.render('detail', { movie: results.data })
  } catch (error) {
    console.log(error)
    res.status(500).render('error.ejs')
  }
})

// 404 middleware
app.use((req, res, next) => {
  res.status(404).render('404.ejs')
})

app.listen(PORT, () => {
  console.log(`listening on PORT:${PORT}`)
  rowdyResults.print()
})

