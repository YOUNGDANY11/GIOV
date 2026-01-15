const express = require('express')
const router = express.Router()

const userController = require('../controllers/userControllers')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const { imageUpload } = require('../middlewares/upfile.middleware')

//Admin
router.get('/', auth, roleMiddleware(1),userController.getAll)
router.get('/id/:id', auth, roleMiddleware(1),userController.getById)
router.get('/document', auth, roleMiddleware(1), userController.getByDocument)
router.get('/name', auth, roleMiddleware(1),userController.getByName)
router.get('/lastname', auth, roleMiddleware(1),userController.getByLastName)
router.post('/', auth, roleMiddleware(1), userController.create)
router.put('/:id', auth, roleMiddleware(1), userController.update)
router.delete('/:id',auth, roleMiddleware(1), userController.deleteUser)

//User normal
router.get('/active', auth, userController.getByUserActive)
router.put('/active/avatar', auth, imageUpload.fields([{ name: 'image', maxCount: 1 }]), userController.updateByUser)

module.exports = router