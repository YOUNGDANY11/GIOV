const express = require('express')
const router = express.Router()

const treatmentController = require('../controllers/treatmentController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

//Admin, directori tecnico, asistente tecnico, entrenador, medico, fisio, quiro
router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getById)
router.get('/staff/document', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByDocumentStaff)
router.get('/staff/name', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByNameStaff)
router.get('/staff/lastname', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByLastNameStaff)
router.get('/athlete/document', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByDocumentAthlete)
router.get('/athlete/name', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByNameAthlete)
router.get('/athlete/lastname', auth, roleMiddleware(1,2,3,4,5,6,7), treatmentController.getByLastNameAthlete)

//Nivel medico, fisio, quiro
router.post('/', auth, roleMiddleware(5,6,7), treatmentController.create)
router.put('/id/:id', auth, roleMiddleware(5,6,7), treatmentController.update)
router.delete('/id/:id', auth, roleMiddleware(5,6,7), treatmentController.deleteTreatment)
router.get('/staff/active', auth, roleMiddleware(5,6,7), treatmentController.getByStaffActive)

//Deportista
router.get('/athlete/active', auth, roleMiddleware(8), treatmentController.getByAthletActive)


module.exports = router