const express = require('express')
const router = express.Router()

const relativeController = require('../controllers/relativeController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

//Admin y roles superiores
router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getById)
router.get('/athlete/document', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getByAthleteDocument)
router.get('/document', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getByDocument)
router.get('/name', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getByName)
router.get('/lastname', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.getByLastName)
router.post('/', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.createByAdmin)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), relativeController.deleteRelative)

//Atletas
router.post('/active', auth,relativeController.create)
router.get('/active', auth, relativeController.getByUserActive)


module.exports = router