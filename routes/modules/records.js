const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

//新增
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      return res.render('new', { categories })
    })
    .catch(error => console.log(error))
})
router.post('/', (req, res) => {
  const userId = req.user._id
  const {name, date, amount, categoryId} = req.body
  return Record.create({ name, date, amount, userId, categoryId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//修改
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      let yyyy = JSON.stringify(record.date).slice(1, 5)
      let mm = JSON.stringify(record.date).slice(6, 8)
      let dd = JSON.stringify(record.date).slice(9, 11)
      Category.find()
        .lean()
        .then((categories) => {
          return res.render('edit', { record, yyyy, mm, dd, categories })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const request = req.body
  return Record.findOne({ _id, userId })
    .then(record => {
      record.name = request.name
      record.date = request.date
      record.categoryId = request.categoryId
      record.amount = request.amount
      return record.save()
    })
    .then(() => res.redirect(`/records/${_id}`))
    .catch(error => console.log(error))
})

//查詢
router.get('/:id', (req, res) => {
  const userId = req.user._id
  return Record.findOne({ userId })
    .lean()
    .then(record => res.redirect('/'))
    .catch(error => console.log(error))
})

//刪除
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router