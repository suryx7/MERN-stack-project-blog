const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  logofile: { 
    type: String, 
  },
  courseOwner: { type: String, required: true },
  cover : { type: String, required: true},
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{
  timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);
