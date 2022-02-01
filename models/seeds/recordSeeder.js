const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Expense = require('../expense')
const expenseList = require('../../expense.json')
expenseNum = expenseList.results.length
const User = require('../user')
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
        { length: expenseNum },
        (_, i) => Expense.create({ name: expenseList.results[`${i}`].name,
        category: expenseList.results[`${i}`].category,
        date: expenseList.results[`${i}`].date,
        amount: expenseList.results[`${i}`].amount,
         userId })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})