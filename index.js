const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

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
const competencieRoutes = require('./routes/competencieRoutes')
const athleteInCompetencieRoutes = require('./routes/athleteInCompetencieRoutes')
const trainingRoutes = require('./routes/trainingRoutes')
const staffInCompetecieRoutes = require('./routes/staffInCompetencieRoute')
const attendanceRoutes = require('./routes/attendanceRoutes')
const injurieRoutes = require('./routes/injurieRoutes') 


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Swagger
app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec)
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true
    }
}))

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
app.use('/api/competencies', competencieRoutes)
app.use('/api/athletesInCompetencies', athleteInCompetencieRoutes)
app.use('/api/trainings', trainingRoutes)
app.use('/api/staffInCompetencies', staffInCompetecieRoutes)
app.use('/api/attendances', attendanceRoutes)
app.use('/api/injuries', injurieRoutes)


app.listen(PORT,() =>{
    console.log(`Server corriendo en el puerto ${PORT}`)
})