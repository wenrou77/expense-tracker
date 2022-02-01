const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../../models/expense')
const CATEGORY = require('../../data.js')

// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  Expense.find({ userId })
    .lean()
    .then(expense => {
      let totalAmount = 0
      expense.forEach(element => {
        totalAmount += element.amount
        element.date = moment(element.date).format("YYYY-MM-DD")
        element.icon = CATEGORY.results.find(category => category.name === element.category).icon
      })
      res.render('index', { expense, totalAmount })
    })
    .catch(error => console.error(error))
})

//搜尋
router.get('/search', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  Expense.find({ category })
    .lean()
    .then(expense => {
      const filteredExpenses = expense.filter(element => element.category === category)
      let totalAmount = 0
      expense.forEach(element => {
        totalAmount += element.amount
        element.date = moment(element.date).format("YYYY-MM-DD")
        element.icon = CATEGORY.find(category => category.name === element.category).icon
      })
      res.render('index', { expense: filteredExpenses, totalAmount })
    })
    .catch(err => console.log(err))
})

module.exports = router