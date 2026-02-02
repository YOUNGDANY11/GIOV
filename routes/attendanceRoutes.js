const express = require('express')
const router = express.Router()

const attendanceController = require('../controllers/attendanceController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
//Admin, directori tecnico, asistente tecnico, entrenador
router.get('/', auth, roleMiddleware(1,2,3,4), attendanceController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4), attendanceController.getById)
router.get('/training/:id', auth, roleMiddleware(1,2,3,4), attendanceController.getByIdTraining)
router.get('/athlete/name', auth, roleMiddleware(1,2,3,4), attendanceController.getByNameAthlete)
router.get('/athlete/lastname', auth, roleMiddleware(1,2,3,4), attendanceController.getByLastNameAthlete)
router.get('/status', auth, roleMiddleware(1,2,3,4), attendanceController.getByStatus)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4), attendanceController.deleteAttendance)

//Deportista
router.post('/', auth, roleMiddleware(8), attendanceController.create)
router.get('/athlete/active',auth, roleMiddleware(8),attendanceController.getByAthleteActive)


module.exports = router