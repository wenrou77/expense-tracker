const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  categoryId: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Category', categorySchema)