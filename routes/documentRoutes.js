const express = require('express')
const router = express.Router()

const documentController = require('../controllers/documentController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const { documentUpload } = require('../middlewares/upfile.middleware')

//Admin
router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), documentController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), documentController.getById)
router.get('/id/:id/download', auth, documentController.downloadById)
router.get('/document', auth, roleMiddleware(1,2,3,4,5,6,7), documentController.getByUserDocument)

// Admin, Director Tecnico, Asistente tecnico y entrenador
router.put('/id/:id', auth, roleMiddleware(1,2,3,4), documentUpload.single('document'), documentController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4), documentController.deleteDocument)

//Deportistas y miembros del staff
router.post('/', auth, documentUpload.single('document'), documentController.create)

module.exports = router