const express = require('express');
require('dotenv').config()
const app = express();

const Pool = require('pg').Pool;


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});


const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})



app.use(express.json());

app.get('/getMovies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM addMovies');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Error fetching movies');
    }
});

app.post('/addMovies', async (req, res) => {
    const moviesToInsert = req.body.movies;

    const insertQuery = 'INSERT INTO addMovies (id, poster_path, backdrop_path, title, average_rating, release_date) VALUES ($1, $2, $3, $4, $5, $6)';

    try {
        await Promise.all(moviesToInsert.map(async (movie) => {
            const values = [
                movie.id,
                movie.poster_path,
                movie.backdrop_path,
                movie.title,
                movie.average_rating,
                movie.release_date,
            ];
            await pool.query(insertQuery, values);
        }));

        console.log('Movies inserted successfully');
        res.send('Movies inserted successfully');
    } catch (error) {
        console.error('Error inserting movies:', error);
        res.status(500).send('Error inserting movies');
    }
});

const server = app.listen(process.env.PORT, function () {
    console.log("Server is running on port 3000")
})

