const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let dp = null;
const dpPath = path.join(__dirname, "moviesData.db");
const connectToDatabase = async () => {
  try {
    dp = await open({
      filename: dpPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("succes");
    });
  } catch (e) {
    console.log(`${e.message}`);
  }
};
connectToDatabase();

const covertMovieTable = (d) => {
  return {
    movieId: d.movie_id,
    directorId: d.director_id,
    movieName: d.movie_name,
    leadActor: d.lead_actor,
  };
};

const convertDirectorTable = (a) => {
  return {
    directorId: a.director_id,
    directorName: a.director_name,
  };
};

app.get("/movies/", async (req, res) => {
  const movieQuery = `SELECT movie_name FROM     movie `;
  const a = await dp.all(movieQuery);
  res.send(a.map((each) => ({ movieName: each.movie_name })));
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
      *
    FROM 
      movie 
    WHERE 
      movie_id = ${movieId};`;
  const movie = await database.get(getMovieQuery);
  response.send(convertMovieDbObjectToResponseObject(movie));
});

app.post("/movies/", async (req, res) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const movieQuery = `INSERT INTO movie(director_id, movie_name, lead_actor) 
  VALUES (${directorId}, '${movieName}', '${leadActor}');
  `;
  await dp.run(movieQuery);
  res.send("Movie Successfully Added");
});

app.put("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const movieUpdate = `UPDATE   movie SET  director_id = ${directorId},
              movie_name = '${movieName}',
              lead_actor = '${leadActor}'
            WHERE
              movie_id = ${movieId};`;
  await dp.run(movieUpdate);
  res.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const deleteMovie = ` DELETE FROM movie WHERE movieId=${movieId}`;
  await dp.run(deleteMovie);
  res.send("Movie Removed");
});

app.get("/directors/", async (req, res) => {
  const movieQuery = `
    SELECT * FROM director
    `;
  const a = await dp.all(movieQuery);
  res.send(a.map((each) => convertDirectorTable(each)));
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  const { directorId } = req.params;
  const mQuery = ` SELECT movie_name FROM movie WHERE directorId=${directorId};`;
  const a = await dp.all(mQuery);
  res.send(a.map((each) => ({ movieName: each.movieName })));
});

module.exports = app;
