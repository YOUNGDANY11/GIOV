const roleModel = require('../models/roleModel')

const getAll = async(req,res)=>{
    try{
        const roles = await roleModel.getAll()
        if(roles.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existen roles'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            roles: roles
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los roles'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_role = id
        const role = await roleModel.getById(id_role)
        if(!role){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este rol no existe'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            rol: role
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los roles'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {name,code} = req.body
        if(!name || !code){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }
        const role = await roleModel.create(name,code)
        return res.status(200).json({
            status:'Success',
            mensaje:'Rol creado con exito',
            rol: role
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear el rol'
        })
    }
}

const deleteRole = async(req,res)=>{
    try{
        const {id} = req.params
        const id_role = id
        const existsRole = await roleModel.getById(id_role)
        if(!existsRole){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este rol'
            })
        }

        const role = await roleModel.deleteRole(id_role)
        return res.status(200).json({
            status:'Success',
            mensaje:'Rol eliminado con exito',
            rol:role
        })
    }catch(error){
        return res.status(500).json({
            status:'Success',
            mensaje:'No se pudo eliminar el rol'
        })
    }
}

module.exports = {
    getAll,
    getById,
    create,
    deleteRole
}