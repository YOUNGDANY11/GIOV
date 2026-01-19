const express = require('express')
const router = express.Router()

const personalInformationController = require('../controllers/personalInformationController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

//Admin y roles superiores
router.get('/', auth, roleMiddleware(1,2,3), personalInformationController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3), personalInformationController.getById)
router.get('/document', auth, roleMiddleware(1,2,3), personalInformationController.getByUserDocument)
router.put('/id/:id', auth, roleMiddleware(1,2,3), personalInformationController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3), personalInformationController.deletePersonalInformation)

//Deportista
router.get('/active', auth, personalInformationController.getByUserActive)
router.post('/', auth,personalInformationController.create)



module.exports = router