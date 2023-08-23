const express = require('express');
const Pool = require('pg').Pool;

const app = express();
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

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

console.log('Starting server...');
const server = app.listen(process.env.PORT, () => {
    console.log('Server started on port 3000');
});


module.exports = app; // Export the Express app
