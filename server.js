// required packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require('rowdy-logger')
const axios = require('axios')

//configure environmental variables
require('dotenv').config()

const OMDB_API_KEY = process.env.OMDB_API_KEY

// configure express app
const app = express()
const PORT = 3000
// (╯°□°）╯︵ ┻━┻
const rowdyResults = rowdy.begin(app)

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
app.get('/', function(req, res) {
  res.render('index')
})

app.get('/results', async(req, res) => {
      try {
        const results = 
        await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${req.query.search}`)
        console.log(results.data.Search)
        res.render('results', { movies: results.data.Search })
    } catch (error) {
        console.log(error)
    }
})
// app.get('/detail/:movie_id', async(req, res) =>{
//     try {
//       const results = 
//       await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${req.params.movie_id}`)
//         res.render('detail', { movie: results.data })
//     } catch (error) {
//         console.log(error)
//     }
// })


app.get('/detail/:movie_id', async (req, res) => {
  try {
    const results = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${req.params.movie_id}`)
    res.render('detail', { movie: results.data })
  } catch (error) {
    console.log(error)
    // res.status(500).render('error.ejs')
  }
})
// The app.listen function returns a server handle
app.listen(PORT, () => {
  console.log(`listening on PORT:${PORT}`)
  rowdyResults.print()
})

