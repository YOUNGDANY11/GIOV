const express = require('express')
const router = express.Router()


const trainingController = require('../controllers/trainingController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')


router.get('/staff/active', auth, roleMiddleware(1,2,3,4), trainingController.getByStaffActive)
router.get('/', auth, roleMiddleware(1,2,3,4,8), trainingController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4), trainingController.getById)
router.get('/staff/:id', auth, roleMiddleware(1,2,3,4), trainingController.getByStaffId)
router.get('/location', auth, roleMiddleware(1,2,3,4), trainingController.getByLocation)

router.post('/', auth, roleMiddleware(1,2,3,4), trainingController.create)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4), trainingController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4), trainingController.deleteTraining)

module.exports = router