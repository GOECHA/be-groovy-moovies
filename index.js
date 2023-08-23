// Entry Point of the API Server

const express = require('express');

/* Creates an Express application.
The express() function is a top-level
function exported by the express module.
*/
const app = express();
const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'gfgbackend',
	password: 'postgres',
	dialect: 'postgres',
	port: 5432
});


/* To handle the HTTP Methods Body Parser
is used, Generally used to extract the
entire body portion of an incoming
request stream and exposes it on req.body
*/
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


// Require the Routes API
// Create a Server and run it on the port 3000
const server = app.listen(3000, function () {
	let host = server.address().address
	let port = server.address().port
	// Starting the Server at the port 3000
})

app.post('/addMovies', (req, res, next) => {
    const moviesToInsert = req.body.movies; // Assuming the request body contains the "movies" array

    const insertQuery = 'INSERT INTO addMovies (id, poster_path, backdrop_path, title, average_rating, release_date) VALUES ($1, $2, $3, $4, $5, $6)';

    const insertPromises = moviesToInsert.map(movie => {
        const values = [
            movie.id,
            movie.poster_path,
            movie.backdrop_path,
            movie.title,
            movie.average_rating,
            movie.release_date
        ];
        return pool.query(insertQuery, values);
    });

    Promise.all(insertPromises)
        .then(results => {
            console.log('Movies inserted successfully');
            res.send('Movies inserted successfully');
        })
        .catch(error => {
            console.error('Error inserting movies:', error);
            res.status(500).send('Error inserting movies');
        });
});

app.get('/getMovies', (req, res, next) => {
    pool.query('SELECT * FROM addMovies')
        .then(result => {
            res.json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            res.status(500).send('Error fetching movies');
        });
});
