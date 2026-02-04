const athleteModel = require('../models/athleteModel')

const getAll = async(req,res)=>{
    try{
        const athletes = await athleteModel.getAll()
        if(athletes.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existen athletas registrados'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            deportistas:athletes
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los deportistas'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_athlete = id
        const athlete = await athleteModel.getById(id_athlete)
        if(!athlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este atleta'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            atleta:athlete
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el atleta'
        })
    }
}

const getByUserDocument = async(req,res)=>{
    try{
        const document = (req.query?.document ?? req.body?.document)

        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }

        const athlete = await athleteModel.getByUserDocument(document)
        if(!athlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay ningun atleta asociado a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            atleta:athlete
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el atleta'
        })
    }
}

const getByDate = async(req,res)=>{
    try{
        const { year } = req.body
        const birthYearRaw = year

        if(!birthYearRaw){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el año de nacimiento'
            })
        }

        const birthYear = Number.parseInt(birthYearRaw, 10)
        if(Number.isNaN(birthYear)){
            return res.status(400).json({
                status:'Error',
                mensaje:'El año de nacimiento no es válido'
            })
        }

        const athletes = await athleteModel.getByDate(birthYear)
        if(athletes.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay deportistas nacidos en este año'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            deportistas:athletes
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los deportistas'
        })
    }
}

const getByStature = async(req,res)=>{
    try{
        const {stature} = req.body
        if(!stature){
            return res.status(400).json({
                status:'Error',
                mensaje:'ES requerida la estatura'
            })
        }

        const athlete = await athleteModel.getByStature(stature)
        if(athlete.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay deportistas con esta estatura'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            deportistas:athlete
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los deportistas'
        })
    }
}

const getByFoot = async(req,res)=>{
    try{
        const {foot} = req.body
        if(!foot){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el pie dominante'
            })
        }

        const athlete = await athleteModel.getByFoot(foot)
        if(athlete.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay deportistas que sean habiles con este pie'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            deportistas:athlete
        })
    }catch(error){
       return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los deportistas'
        }) 
    }   
}

const getByAthleteActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const athlete = await athleteModel.getByUserId(id_user)
        if(!athlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            deportista:athlete
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el deportista'
        })
    }
}

const createByUserActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {date,foot,address, blood_type,stature} = req.body
        if(!date || !foot || !address || !blood_type || !stature){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsAthlete = await athleteModel.getByUserId(id_user)
        if(existsAthlete){
            return res.status(400).json({
                status:'Error',
                mensaje:'Ya estas registrado como deportista'
            })
        }

        const athlete = await athleteModel.create(id_user,date,foot,address,blood_type,stature)
        return res.status(200).json({
            status:'Success',
            mensaje:'Deportista registrado con exito',
            deportista:athlete
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear el deportista'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_athlete = id
        const {date,foot,address,blood_type,stature} = req.body

        if(!date || !address || !blood_type || !stature || !foot){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida la direccion y la estatura'
            })
        }

        const existsAthlete = await athleteModel.getById(id_athlete)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const athlete = await athleteModel.update(date,foot,address,blood_type,stature,id_athlete)
        return res.status(200).json({
            status:'Success',
            mensaje:'Deportista actualizado con exito',
            deportista:athlete
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el deportista'
        })
    }
}

const updateByAthlete = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {address,stature,foot} = req.body
        if(!address || !stature || !foot){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsAthlete = await athleteModel.getByUserId(id_user)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const athlete = await athleteModel.updateByAthlete(address,stature,foot,id_user)
        return res.status(200).json({
            status:'Success',
            mensaje:'Actualizacion exitosa',
            deportista:athlete
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el deportista'
        })
    }
}

const deleteAthlete = async(req,res)=>{
    try{
        const {id} = req.params
        const id_athlete = id
        const existsAthlete = await athleteModel.getById(id_athlete)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const athlete = await athleteModel.deleteAthlete(id_athlete)
        return res.status(200).json({
            status:'Success',
            mensaje:'Deportista eliminado con exito',
            deportista:athlete
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo eliminar el deportista'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByUserDocument,
    getByDate,
    getByStature,
    getByFoot,
    getByAthleteActive,
    createByUserActive,
    update,
    updateByAthlete,
    deleteAthlete
}