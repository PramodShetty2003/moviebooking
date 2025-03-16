const express = require('express');
const router = express.Router();
//const { Movie } = require('../models');  // Make sure this is the correct path
const movieController = require('../controllers/movie.controller');

// POST: Add a new movie
// router.post('/movies', async (req, res) => {
//   try {
//     const movie = new Movie(req.body);
//     const savedMovie = await movie.save();
//     res.status(201).send(savedMovie);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

router.get('/movies',movieController.findAllMovies);
router.get('/movies/:id',movieController.findOne);
router.get('/movies/:movieid/shows',movieController.findShows);

module.exports = router;
