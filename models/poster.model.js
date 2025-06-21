const mongoose = require('mongoose');


const posterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  description: String,
  category: {
    type: String,
    enum: ['Electronics', 'Vehicles', 'Clothing', 'Real Estate', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Poster', posterSchema);
