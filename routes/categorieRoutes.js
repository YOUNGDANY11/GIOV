const express = require('express')
const router = express.Router()

const categorieController = require('../controllers/categorieController')
const auth = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

//Admin y roles superiores
router.get('/', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.getAll)
router.get('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.getById)
router.get('/year', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.getByYear)
router.post('/', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.create)
router.put('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.update)
router.delete('/id/:id', auth, roleMiddleware(1,2,3,4,5,6,7), categorieController.deleteCategorie)

module.exports = router