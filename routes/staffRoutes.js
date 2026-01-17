const express = require('express')
const router = express.Router()

const staffController = require('../controllers/staffController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
//Admin y roles superiores
router.get('/', auth,  roleMiddleware(1,2,3), staffController.getAll)
router.get('/id/:id', auth,  roleMiddleware(1,2,3), staffController.getById)
router.get('/document', auth,  roleMiddleware(1,2,3), staffController.getByDocument)
router.put('/id/:id', auth,  roleMiddleware(1,2,3), staffController.update)
router.delete('/id/:id', auth,  roleMiddleware(1,2,3), staffController.deleteStaff)


//Entrenador, Medico general, fisio, quiropractico,
router.get('/active', auth, roleMiddleware(4,5,6,7), staffController.getByUserActive)
router.post('/active', auth, roleMiddleware(4,5,6,7), staffController.create)
router.put('/active', auth, roleMiddleware(4,5,6,7), staffController.updateByStaff)


module.exports = router