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
// db.once('open', () => {
//   Promise.all(Array.from([SEED_USER], SEED_USER => {
//     return bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(SEED_USER.password, salt))
//       .then(hash => User.create({
//         name: SEED_USER.name,
//         email: SEED_USER.email,
//         password: hash
//       }))
//       .then((user) => {
//         const userId = user._id
//         return Category.find()
//           .lean()
//           .then((categories) => {
//             let categoryId = []
//             Array.from({ length: categoryNum }, (_, i) => recordList.forEach((record) => {
//               if (record.category === categories[i].name) {
//                 categoryId.push(categories[i]._id)
//                 return categoryId
//               }
//             })
//             )
//             Array.from({ length: recordNum }, (_, i) => {
//               console.log(recordList[`${i}`].name, ' ', categoryId[`${i}`])
//               return Record.create({
//                 name: recordList[`${i}`].name,
//                 date: recordList[`${i}`].date,
//                 amount: recordList[`${i}`].amount,
//                 userId,
//                 categoryId: categoryId[`${i}`]
//               })
//             })
//           })
//       })
//   })).then(() => {
//     console.log('record seeder done.')
//     process.exit()
//   }).catch(error => {
//     console.log(error)
//   })
// })

db.once('open', () => {
  Promise.all(Array.from([SEED_USER], SEED_USER => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        return Promise.all(Array.from({ length: recordNum }, (_, i) => {
          return Category.findOne({ name: recordList[i].category })
            .then(category => {
              const categoryId = category._id
              recordList[i].categoryId = categoryId
              recordList[i].userId = userId
              return recordList[i]
            }).then(recordData => {
              return Record.create(recordData)
            })
        })
        )
      })
  })).then(() => {
    console.log('record seeder done.')
    process.exit()
  }).catch(error => {
    console.log(error)
  })
})