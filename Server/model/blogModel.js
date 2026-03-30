const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'Unknown',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
    
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
