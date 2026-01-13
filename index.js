const express = require('express')
const cors = require('cors')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PORT,() =>{
    console.log(`Server corriendo en el puerto ${PORT}`)
})