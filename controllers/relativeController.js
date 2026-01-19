const relativeModel = require('../models/relativeModel')

const getAll = async(req,res)=>{
    try{
        const relatives = await relativeModel.getAll()
        if(relatives.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay parientes registrados'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            parientes:relatives
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de los parientes'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_relative = id
        const relative = await relativeModel.getById(id_relative)
        if(!relative){
            return res.status(404).json({
                status:'Error',
                mensaje:'Esta informacion de pariente no existe'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de este pariente'
        })
    }
}

const getByAthleteDocument = async(req,res)=>{
    try{
        const {document} = req.body

        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }

        const relative = await relativeModel.getByAthleteDocument(document)
        if(relative.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe parentesco asociado a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de este pariente'
        })
    }
}


const getByDocument = async(req,res)=>{
    try{
        const {document} = req.body

        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }

        const relative = await relativeModel.getByDocument(document)
        if(!relative){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe parentesco asociado a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de este pariente'
        })
    }
}

const getByName = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el primer o segundo nombre de la persona'
            })
        }

        const relative = await relativeModel.getByName(name)
        if(relative.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe ningun pariente con este nombre'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de este pariente'
        })
    }
}

const getByLastName = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el primer o segundo apellido de la persona'
            })
        }

        const relative = await relativeModel.getByLastName(lastname)
        if(relative.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe ningun pariente con este nombre'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion de este pariente'
        })
    }
}

const getByUserActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const relatives = await relativeModel.getByUserId(id_user)
        if(relatives.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No tienes registrado ningun pariente'
            })
        }
        
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            parientes:relatives
        })
    }catch(error){
        return res.status
    }
}

const create = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {name,lastname,document,email,country,deparment,city, type} = req.body
        if(!name || !lastname || !document || !email || !country || !deparment || !city || !type){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacio'
            })
        }

        const relative = await relativeModel.create(id_user,name,lastname,document,email,country,deparment,city, type)
        return res.status(200).json({
            status:'Success',
            mensaje:'Pariente creado con exito',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear la informacion de este pariente'
        })
    }
}

const createByAdmin = async(req,res)=>{
    try{
        const {id_user,name,lastname,document,email,country,deparment,city, type} = req.body
        if(!id_user || !name || !lastname || !document || !email || !country || !deparment || !city || !type){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacio'
            })
        }

        const relative = await relativeModel.create(id_user,name,lastname,document,email,country,deparment,city, type)
        return res.status(200).json({
            status:'Success',
            mensaje:'Pariente creado con exito',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear la informacion de este pariente'
        })
    }
}
const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_relative = id
        const {name,lastname,document,email,country,deparment,city, type} = req.body
        if(!name || !lastname || !document || !email || !country || !deparment || !city || !type){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacio'
            })
        }

        const existsRelative = await relativeModel.getById(id_relative)
        if(!existsRelative){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe informacion de este pariente'
            })
        }

        const relative = await relativeModel.update(name,lastname,document,email,country,deparment,city, type,id_relative)
        return res.status(200).json({
            status:'Success',
            mensaje:'Actualizacion de informacion con exito',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible actualizar la informacion de este pariente'
        })
    }
}

const deleteRelative = async(req,res)=>{
    try{
        const {id} = req.params
        const id_relative = id

        const existsRelative = await relativeModel.getById(id_relative)
        if(!existsRelative){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este pariente'
            })
        }

        const relative = await relativeModel.deleteRelative(id_relative)
        return res.status(200).json({
            status:'Success',
            mensaje:'Pariente eliminado con exito',
            pariente:relative
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar la informacion de este pariente'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByAthleteDocument,
    getByDocument,
    getByName,
    getByLastName,
    getByUserActive,
    create,
    createByAdmin,
    update,
    deleteRelative
}