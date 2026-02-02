const express = require('express')
const router = express.Router()


const trainingController = require('../controllers/trainingController')

router.get('/', trainingController.getAll)
router.get('/id/:id', trainingController.getById)
router.get('/staff/:id', trainingController.getByStaffId)
router.get('/location', trainingController.getByLocation)

router.post('/', trainingController.create)
router.put('/id/:id', trainingController.update)
router.delete('/id/:id', trainingController.deleteTraining)

module.exports = router