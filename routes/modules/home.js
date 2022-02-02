const express = require('express')
const router = express.Router()
const moment = require('moment')
const Record = require('../../models/record')
const Category = require('../../models/category')

// 首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .then(record => {
      let totalAmount = 0
      record.forEach(element => {
        totalAmount += element.amount
        element.date = moment(element.date).format("YYYY-MM-DD")
        Category.findOne({ "_id": element.categoryId})
          .lean()
          .then(category => element.icon = category.icon)
      })
      Category.find()
        .lean()
        .then((categories) => {
          return res.render('index', { record, totalAmount, categories })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.error(error))
})

//搜尋
router.get('/search', (req, res) => {
  const userId = req.user._id
  const categoryId = req.query.categoryId
  if ( categoryId != 6 ) {
    Record.find({ categoryId, userId })
      .lean()
      .then(record => {
        const filteredRecords = record.filter(element => element.categoryId == categoryId)
        let totalAmount = 0
        record.forEach(element => {
          totalAmount += element.amount
          element.date = moment(element.date).format("YYYY-MM-DD")
          Category.findOne({ "_id": element.categoryId })
            .lean()
            .then(category => element.icon = category.icon)
        })
        Category.find()
          .lean()
          .then((categories) => {
            var warning_msg = (totalAmount === 0) ? '此類別沒有花費紀錄' : '';
            return res.render('index', { record: filteredRecords, totalAmount, categories, warning_msg })
          })
          .catch(error => console.log(error))
      })
      .catch(err => console.log(err))
  } else {
    res.redirect('/')
  }
})

module.exports = router