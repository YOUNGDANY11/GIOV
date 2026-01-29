const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const athleteController = require('../controllers/athleteController')

//Admin y cuerpo tecnico
router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getById)
router.get('/document', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getByUserDocument)
router.get('/date', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getByDate)
router.get('/stature', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getByStature)
router.get('/foot', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.getByFoot)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), athleteController.update)

//Deportistas
router.post('/active', auth, roleMiddleware(8),athleteController.createByUserActive)
router.get('/active', auth, roleMiddleware(8), athleteController.getByAthleteActive)
router.put('/', auth, auth, roleMiddleware(8), athleteController.updateByAthlete)

module.exports = router