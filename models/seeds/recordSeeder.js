const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const User = require('../user')
const Record = require('../record')
const recordList = require('../../record.json')
const categoryList = require('../../category.json')
recordNum = recordList.results.length

const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: recordNum },
        (_, i) => Record.create({ name: recordList.results[`${i}`].name,
        date: recordList.results[`${i}`].date,
        amount: recordList.results[`${i}`].amount,
        userId,
        categoryId: categoryList.results[`${i}`].name, })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})