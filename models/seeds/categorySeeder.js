if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Category = require('../category')
const categoryList = require('../../category.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  Category.insertMany(categoryList).then(() => {
    console.log('category seeder done.')
    process.exit()
  })
})