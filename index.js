const express = require('express')
const cors = require('cors')
require('dotenv').config()

//Importaciones
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const roleRoutes = require('./routes/rolesRoutes')
const documentRoutes = require('./routes/documentRoutes')
const athleteRoutes = require('./routes/athleteRoutes')
const staffRoutes = require('./routes/staffRoutes')
const personalInformationRoutes = require('./routes/personalInformationRoutes')
const relativeRoutes = require('./routes/relativeRoutes')
const categorieRoutes = require('./routes/categorieRoutes')


const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Endpoints
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/roles',roleRoutes)
app.use('/api/documents',documentRoutes)
app.use('/api/athletes',athleteRoutes)
app.use('/api/staff',staffRoutes)
app.use('/api/personalInf',personalInformationRoutes)
app.use('/api/relatives', relativeRoutes)
app.use('/api/categories', categorieRoutes)

app.listen(PORT,() =>{
    console.log(`Server corriendo en el puerto ${PORT}`)
})