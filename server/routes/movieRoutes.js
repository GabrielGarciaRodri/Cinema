const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const filters = {};
    if (req.query.genre) filters.genre = req.query.genre;
    if (req.query.releaseDate) filters.releaseDate = req.query.releaseDate;

    const sortOptions = {};
    if (req.query.sortBy) {
      sortOptions[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    }

    const movies = await Movie.find(filters)
      .sort(sortOptions)
      .limit(limit)
      .skip(skipIndex);

    const total = await Movie.countDocuments(filters);

    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ 
      message: 'Server error fetching movies',
      error: error.message 
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        message: 'Movie not found' 
      });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ 
      message: 'Server error fetching movie',
      error: error.message 
    });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Unauthorized: Admin access required' 
      });
    }

    const { 
      title, 
      description, 
      genre, 
      releaseDate, 
      rating,
      banner 
    } = req.body;

    // Create new movie
    const newMovie = new Movie({
      title,
      description,
      genre,
      releaseDate,
      director,
      rating,
      banner
    });

    // Save movie to database
    const savedMovie = await newMovie.save();

    res.status(201).json({
      message: 'Movie created successfully',
      movie: savedMovie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ 
      message: 'Server error creating movie',
      error: error.message 
    });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Unauthorized: Admin access required' 
      });
    }

    const { 
      title, 
      description, 
      genre, 
      releaseDate, 
      director, 
      rating,
      banner 
    } = req.body;

    // Find and update movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        genre, 
        releaseDate,
        director, 
        rating,
        banner 
      },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ 
        message: 'Movie not found' 
      });
    }

    res.json({
      message: 'Movie updated successfully',
      movie: updatedMovie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ 
      message: 'Server error updating movie',
      error: error.message 
    });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Unauthorized: Admin access required' 
      });
    }

    // Find and delete movie
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ 
        message: 'Movie not found' 
      });
    }

    res.json({
      message: 'Movie deleted successfully',
      movie: deletedMovie
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ 
      message: 'Server error deleting movie',
      error: error.message 
    });
  }
});

module.exports = router;