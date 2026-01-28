const express = require('express')
const router = express.Router()

const athleteInCompetencieController = require('../controllers/athleteInCompetencieController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')


//Admin, directori tecnico, asistente tecnico, entrenador
router.get('/', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.getById)
router.get('/document', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.getByDocumentAthlete)
router.post('/', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.create)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4), athleteInCompetencieController.deleteAthlInComp)

module.exports = router