const express = require('express')
const router = express.Router()

const competencieController = require('../controllers/competencieController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.getById)
router.get('/categorie', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.getByCategorieName)
router.get('/name', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.getByName)
router.get('/status', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.getByStatus)
router.post('/', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.create)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), competencieController.deleteCompetencie)

module.exports = router