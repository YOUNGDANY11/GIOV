const express = require('express')
const router = express.Router()

const injurieController = require('../controllers/injurieController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), injurieController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), injurieController.getById)
router.get('/athlete/document', auth, roleMiddleware(1,2,3,4,5,6,7), injurieController.getByDocumentAthlete)
router.get('/athlete/name', auth, roleMiddleware(1,2,3,4,5,6,7), injurieController.getByNameAthlete)
router.get('/athlete/lastname', auth, roleMiddleware(1,2,3,4,5,6,7), injurieController.getByLastNameAthlete)
router.get('/athlete/active', auth, roleMiddleware(8), injurieController.getByAthleteActive)
router.post('/', auth, roleMiddleware(5,6,7), injurieController.create)
router.put('/id/:id', auth, roleMiddleware(5,6,7), injurieController.update)
router.delete('/id/:id', auth, roleMiddleware(5,6,7), injurieController.deleteInjurie)

module.exports = router