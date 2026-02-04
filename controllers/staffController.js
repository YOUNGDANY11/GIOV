const staffModel = require('../models/staffModel')

const getAll = async(req,res)=>{
    try{
        const staff = await staffModel.getAll()
        if(staff.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay staff registrado'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staff
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el cuerpo tecnico'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_staff = id
        const staff = await staffModel.getById(id_staff)
        if(!staff){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este miembro no existe'
            })
        }

        return res.status(200).json({
            stauts:'Success',
            mensaje:'Consulta exitosa',
            staff:staff
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el integrante del cuerpo tecnico'
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

        const staff = await staffModel.getByUserDocument(document)
        if(!staff){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay ningun miembro asociado a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staff
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el integrante del cuerpo tecnico'
        })
    }
}

const getByUserActive = async(req,res) =>{
    try{
        const {id} = req.user
        const id_user = id
        const staff = await staffModel.getByUserId(id_user)
        if(!staff){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este usuario no es staff'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staff
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el integrante del cuerpo tecnico'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {date,address,blood_type,information,description} = req.body
        if(!date || !address || !blood_type || !information || !description){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }
        const existsStaff = await staffModel.getByUserId(id_user)
        if(existsStaff){
            return res.status(400).json({
                status:'Error',
                mensaje:'Solo puede haber una caracterizacion por miembro'
            })
        }

        const staff = await staffModel.create(id_user,date,address,blood_type,information,description)
        return res.status(200).json({
            status:'Success',
            mensaje:'Miembro creado con exito',
            staff:staff
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear el integrante del cuerpo tecnico'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_staff = id
        const {date,address,blood_type,information,description} = req.body
        if(!date || !address || !blood_type || !information || !description){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsStaff = await staffModel.getById(id_staff)
        if(!existsStaff){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este miembro'
            })
        }

        const staff = await staffModel.update(date,address,blood_type,information,description,id_staff)
        return res.status(200).json({
            status:'Success',
            mensaje:'Miembro actualizado con exito',
            staff:staff
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el integrante del cuerpo tecnico'
        })
    }
}

const updateByStaff = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const {address,information,description} = req.body
        if(!address || !information || !description){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsStaff = await staffModel.getByUserId(id_user)
        if(!existsStaff){
            return res.status(404).json({
                status:'Error'
            })
        }

        const staff = await staffModel.updateByStaff(address,information,description,id_user)
        return res.status(200).json({
            status:'Success',
            mensaje:'Miembro actualizado con exito',
            staff:staff
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el integrante del cuerpo tecnico'
        })
    }
}


const deleteStaff = async(req,res)=>{
    try{
        const {id} = req.params
        const id_staff = id

        const existsStaff = await staffModel.getById(id_staff)
        if(!existsStaff){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este miembro'
            })
        }

        const staff = await staffModel.deleteStaff(id_staff)
        return res.status(200).json({
            status:'Success',
            mensaje:'Miembro eliminado con exito',
            staff:staff
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo eliminar el integrante del cuerpo tecnico'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByDocument,
    getByUserActive,
    create,
    update,
    updateByStaff,
    deleteStaff
}