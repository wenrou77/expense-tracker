const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Expense = require('../expense')
const expenseList = require('../../expense.json')
expenseNum = expenseList.results.length
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USERS = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  Promise.all(
    SEED_USERS.map((user, user_index) => {
      // 創建使用者資料(user): model.create
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          email: user.email,
          password: hash
        })).then((user) => {
          const userExpense = []
          expenseList.results.forEach((expense, rest_index) => {
            if (rest_index >= 3 * user_index && rest_index < 3 * (user_index + 1)) {
              expense.userId = user._id
              userExpense.push(expense)
            }
          })
          // 對每個user建立相對應花費資料
          return Expense.create(userExpense)
        })
    })
  ).then(() => {
    // 等待所有使用者的花費資料創建完成
    console.log('所有使用者與花費資料創建完成')
    process.exit()
  }).catch(error => {
    console.log(error)
  })
})