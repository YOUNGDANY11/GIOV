const injurieModel = require('../models/injurieModel')
const athleteModel = require('../models/athleteModel')
const getAll = async(req,res)=>{
    try{
        const injuries = await injurieModel.getAll()
        if(injuries.length === 0){
            return res.status(404).json({
                status:'Error',
                mensajes:'No hay registros de lesiones'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            lesiones:injuries
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_injury = id
        const injurie = await injurieModel.getById(id_injury)
        if(!injurie){
            return res.status(404).json({
                status:'Error',
                mensajes:'No existe este registro de lesion'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            lesion:injurie
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const getByDocumentAthlete = async(req,res)=>{
    try{
        const {document} = req.body
        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }
        const injuries = await injurieModel.getByDocumentAthlete(document)
        if(injuries.length === 0){
            return res.status(404).json({
                status:'Error',
                mensajes:'No existe registros de lesiones asociados a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            lesiones:injuries
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const getByNameAthlete = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre del deportista'
            })
        }
        const injuries = await injurieModel.getByNameAthlete(name)
        if(injuries.length === 0){
            return res.status(404).json({
                status:'Error',
                mensajes:'No existe registros de lesiones asociados a este atleta'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            lesiones:injuries
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const getByLastNameAthlete = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el apellido del deportista'
            })
        }
        const injuries = await injurieModel.getByLastNameAthlete(lastname)
        if(injuries.length === 0){
            return res.status(404).json({
                status:'Error',
                mensajes:'No existe registros de lesiones asociados a este atleta'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            lesiones:injuries
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const getByAthleteActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_athlete = id
        const injuries = await injurieModel.getByIdAthlete(id_athlete)
        if(injuries.length === 0){
            return res.status(404).json({
                status:'Error',
                mensajes:'No existe registros de lesiones'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            lesiones:injuries
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el registro de lesiones'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id_athlete,name,description,date,status} = req.body
        if(!id_athlete || !name || !description || !date || !status) {
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }
        const existsAthlete = await athleteModel.getById(id_athlete)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este athleta'
            })
        }
        const injurie = await injurieModel.create(id_athlete,name,description,date,status)
        return res.status(200).json({
            status:'Success',
            mensaje:'Lesion creada con exito',
            lesion:injurie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear el registro de lesiones'
        })
    }
}


const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_injury = id
        const {status} = req.body
        if(!status) {
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida el estado'
            })
        }
        const existsInjurie = await injurieModel.getById(id_injury)
        if(!existsInjurie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta lesion'
            })
        }
        const injurie = await injurieModel.update(status, id_injury)
        return res.status(200).json({
            status:'Success',
            mensaje:'Lesion actualizada con exito',
            lesion:injurie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear el registro de lesiones'
        })
    }
}

const deleteInjurie = async(req,res)=>{
    try{
        const {id} = req.params
        const id_injury = id
        const existsInjurie = await injurieModel.getById(id_injury)
        if(!existsInjurie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta lesion'
            })
        }
        const injurie = await injurieModel.deleteInjurie(id_injury)
        return res.status(200).json({
            status:'Success',
            mensaje:'Lesion eliminada con exito',
            lesion:injurie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear el registro de lesiones'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByDocumentAthlete,
    getByNameAthlete,
    getByLastNameAthlete,
    getByAthleteActive,
    create,
    update,
    deleteInjurie
}