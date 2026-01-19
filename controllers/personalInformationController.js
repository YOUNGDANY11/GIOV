const personalInfModel = require('../models/personalInformationModel')

const getAll = async(req,res)=>{
    try{
        const personalInf = await personalInfModel.getAll()
        if(personalInf.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe informacion personal de ningun usuario'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            informacion_personal:personalInf
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion personal'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_per_inf = id
        const personalInf = await personalInfModel.getById(id_per_inf)
        if(!personalInf){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta informacion personal'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            informacion_personal:personalInf
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion personal'
        })
    }
}

const getByUserDocument = async(req,res)=>{
    try{
        const {document} = req.body

        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }

        const personalInf = await personalInfModel.getByUserDocument(document)
        if(!personalInf){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe informacion personal asociada a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            informacion_personal:personalInf
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion personal'
        })
    }
}

const getByUserActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const personalInf = await personalInfModel.getByUserId(id_user)
        if(!personalInf){
            return res.status(404).json({
                status:'Error',
                mensaje:'No tienes informacion personal registrada'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            informacion_personal:personalInf
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la informacion'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {country,deparment,city,email} = req.body
        
        if(!country || !deparment || !city || !email){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsPersonalInf = await personalInfModel.getByUserId(id_user)
        if(existsPersonalInf){
            return res.status(400).json({
                status:'Error',
                mensaje:'Solo se puede crear una informacion personal por usuario'
            })
        }

        const personalInf = await personalInfModel.create(id_user,country,deparment,city,email)
        return res.status(200).json({
            status:'Success',
            mensaje:'Informacion personal registrada con exito',
            informacion_personal:personalInf
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear la informacion personal'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_per_inf = id
        const {country,deparment,city,email} = req.body
        
        if(!country || !deparment || !city || !email){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsPersonalInf = await personalInfModel.getById(id_per_inf)
        if(!existsPersonalInf){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta informacion personal'
            })
        }

        const personalInf = await personalInfModel.update(country,deparment,city,email,id_per_inf)
        return res.status(200).json({
            status:'Success',
            mensaje:'Actualizado con exito',
            informacion_personal:personalInf
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible actualizar la informacion personal'
        })
    }
}

const deletePersonalInformation = async(req,res)=>{
    try{
        const {id} = req.params
        const id_per_inf = id
        const existsPersonalInf = await personalInfModel.getById(id_per_inf)
        if(!existsPersonalInf){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta informacion personal'
            })
        }

        const personalInf = await personalInfModel.deletePersonalInformation(id_per_inf)
        return res.status(200).json({
            status:'Success',
            mensaje:'Eliminado con exito',
            informacion_personal:personalInf
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar la informacion personal'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByUserDocument,
    getByUserActive,
    create,
    update,
    deletePersonalInformation
}