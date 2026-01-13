const express = require('express')
const router = express.Router()

const userController = require('../controllers/userControllers')

router.get('/', userController.getAll)
router.get('/id/:id', userController.getById)
router.get('/document', userController.getByDocument)
router.get('/name', userController.getByName)
router.get('/lastname', userController.getByLastName)

router.post('/', userController.create)

router.put('/:id', userController.update)

router.delete('/:id', userController.deleteUser)

module.exports = router