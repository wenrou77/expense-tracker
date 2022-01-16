const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

//新增
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  const userId = req.user._id
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount
  return Expense.create({ userId, name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//修改
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Expense.findOne({ _id, userId })
    .lean()
    .then(expense => res.render('edit', { expense }))
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const request = req.body
  return Expense.findOne({ _id, userId })
    .then(expense => {
      expense.name = request.name
      expense.date = request.date
      expense.category = request.category
      expense.amount = request.amount
      return expense.save()
    })
    .then(() => res.redirect(`/expenses/${_id}`))
    .catch(error => console.log(error))
})

//查詢
router.get('/:id', (req, res) => {
  const userId = req.user._id
  return Expense.findOne({ userId })
    .lean()
    .then(expense => res.redirect('/'))
    .catch(error => console.log(error))
})

//刪除
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Expense.findOne({ _id, userId })
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router