const express = require('express')
const router = express.Router()

const roleController = require('../controllers/roleController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

//Admin
router.get('/', auth,roleMiddleware(1),roleController.getAll)
router.get('/id/:id',auth,roleMiddleware(1), roleController.getById)

router.post('/', auth,roleMiddleware(1),roleController.create)

router.delete('/:id', auth, roleMiddleware(1), roleController.deleteRole)

module.exports = router