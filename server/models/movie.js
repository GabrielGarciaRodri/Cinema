const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  genre: {
    type: [String],
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  banner: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);