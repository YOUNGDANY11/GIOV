const express = require('express')
const cors = require('cors')
require('dotenv').config()

//Importaciones
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Endpoints
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)

app.listen(PORT,() =>{
    console.log(`Server corriendo en el puerto ${PORT}`)
})