const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const recordList = require('../../record.json')
const categoryList = require('../../category.json')
const recordNum = recordList.length
const categoryNum = categoryList.length
const SEED_USER = 
{
  "name": "root",
  "email": "root@example.com",
  "password": "12345678"
}

const db = require('../../config/mongoose')
db.once('open', ()=> {
  Promise.all(
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash}))
      .then((user) => {
        const userId = user._id
        Category.find()
          .lean()
          .then((categories) => {
            let categoryId = []
            for (var i = 0; i <= categoryNum - 1; i++) {
              for (let record of recordList) {
                if (record.category === categories[i].name) {
                  categoryId.push(categories[i]._id)
                }
              }
            }
            return Array.from({ length: recordNum }, (_, i) =>
              Record.create({
                name: recordList[`${i}`].name,
                date: recordList[`${i}`].date,
                amount: recordList[`${i}`].amount,
                userId, categoryId: categoryId[`${i}`]
              })
            )
          })
        })
  ).then(() => {
    console.log('record seeder done.')
    process.exit()
  }).catch(error => {
    console.log(error)
  })
})