const express = require('express')
const router = express.Router()

const documentController = require('../controllers/documentController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const { documentUpload } = require('../middlewares/upfile.middleware')

//Admin
router.get('/', auth,roleMiddleware(1,2,3), documentController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3), documentController.getById)
router.get('/id/:id/download', auth, documentController.downloadById)
router.get('/document', auth, roleMiddleware(1,2,3), documentController.getByUserDocument)
router.put('/id/:id', auth, roleMiddleware(1,2,3), documentUpload.single('document'), documentController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3), documentController.deleteDocument)

//Deportistas y miembros del staff
router.post('/', auth, documentUpload.single('document'), documentController.create)

module.exports = router