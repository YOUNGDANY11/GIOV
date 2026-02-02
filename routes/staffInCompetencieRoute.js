const express = require('express')
const router = express.Router()

const staffInCompetencieController = require('../controllers/staffInCompetencieController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')


//Admin, directori tecnico, asistente tecnico, entrenador
router.get('/', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.getById)
router.get('/document', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.getByDocumentStaff)
router.get('/name', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.getByNameStaff)
router.get('/lastname', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.getByLastNameStaff)
router.post('/', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.create)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4), staffInCompetencieController.deleteStaffInComp)

module.exports = router