// require axios
const axios = require('axios')

// configure enviromental variables
require('dotenv').config()
const OMDB_API_KEY = process.env.OMDB_API_KEY

axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s="Star Wars"`)
.then(results => {
  console.log(results.data)
})

async function hitOmdb() {
  const results = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s="Cowboy"&y=1964`)
  console.log(results.data)
}

hitOmdb()
