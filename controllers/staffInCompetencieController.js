const staffInCompModel = require('../models/staffInCompetencieModel')
const staffModel = require('../models/staffModel')
const competencieModel = require('../models/competencieModel')

const getAll = async(req,res)=>{
    try{
        const staffInComp = await staffInCompModel.getAll()
        if(staffInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay staff registrados en competencia'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staffInComp
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el staff en competencia'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_staff_comp = id
        const staffInComp = await staffInCompModel.getById(id_staff_comp)
        if(!staffInComp){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este registro'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staffInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el staff en competencia'
        })
    }
}

const getByDocumentStaff = async(req,res)=>{
    try{
        const {document} = req.body

        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }

        const staffInComp = await staffInCompModel.getByDocumentStaff(document)
        if(staffInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe registro de competencia de este staff'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staffInComp
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el staff en competencia'
        })
    }
}

const getByNameStaff = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre del deportista'
            })
        }
        const staffInComp = await staffInCompModel.getByNameStaff(name)
        if(staffInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este staff no esta en competencia'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staffInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el/o staff en competencia'
        })
    }
}

const getByLastNameStaff = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre del deportista'
            })
        }
        const staffInComp = await staffInCompModel.getByLastNameStaff(lastname)
        if(staffInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este staff no esta en competencia'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            staff:staffInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el/o staff en competencia'
        })
    }
}

const create =  async(req,res)=>{
    try{
        const {id_staff,id_competencie} = req.body
        if(!id_staff || !id_competencie){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsStaff = await staffModel.getById(id_staff)
        if(!existsStaff){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este staff'
            })
        }

        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta competencia'
            })
        }

        const validStaffInComp = await staffInCompModel.getStaffInCompetencieActive(id_staff,id_competencie)
        if(validStaffInComp.length >= 1){
            return res.status(400).json({
                status:'Error',
                mensaje:'Este staff ya esta asociado a la competencia'
            })
        }

        const staffInComp = await staffInCompModel.create(id_staff,id_competencie)
        return res.status(200).json({
            status:'Success',
            mensaje:'Asignacion de competencia ha sido exitosa',
            staffInComp
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear el staff en competencia'
        })
    }
}

const update  = async(req,res)=>{
    try{    
        const {id} = req.params
        const id_staff_comp = id
        const {id_staff,id_competencie} = req.body
        if(!id_staff || !id_competencie){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsStaff = await staffModel.getById(id_staff)
        if(!existsStaff){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este staff'
            })
        }

        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta competencia'
            })
        }

        const validStaffInComp = await staffInCompModel.getStaffInCompetencieActive(id_staff,id_competencie)
        if(validStaffInComp.length >= 1){
            return res.status(400).json({
                status:'Error',
                mensaje:'Este staff ya esta asociado a la competencia'
            })
        }

        const staffInComp = await staffInCompModel.update(id_staff,id_competencie,id_staff_comp)
        return res.status(200).json({
            status:'Success',
            mensaje:'Actualizado con exito',
            staffInComp
        })

    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible actualizar el staff en competencia'
        })
    }
}

const deleteStaffInComp = async(req,res)=>{
    try{
        const {id} = req.params
        const id_staff_comp = id

        const existsStaffInCom = await staffInCompModel.getById(id_staff_comp)
        if(!existsStaffInCom){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este registro'
            })
        }

        const staffInComp = await staffInCompModel.deleteStaffInComp(id_staff_comp)
        return res.status(200).json({
            status:'Success',
            mensaje:'El staff ha sido eliminado de esta competencia de forma exitosa',
            staffInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar el staff en competencia'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByDocumentStaff,
    getByNameStaff,
    getByLastNameStaff,
    create,
    update,
    deleteStaffInComp
}