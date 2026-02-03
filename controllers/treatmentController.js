const treatmentModel = require('../models/treatmentModel')
const staffModel = require('../models/staffModel')
const getAll = async(req,res)=>{
    try{
        const treatments = await treatmentModel.getAll()
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados'
            })
        }
        return  res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){  
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_treatment = id
        const treatment =  await treatmentModel.getById(id_treatment)
        if(!treatment){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este tratamiento'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamiento:treatment
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el tratamiento'
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
        const treatments = await treatmentModel.getByDocumentStaff(document)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados por este miembro'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByNameStaff = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre'
            })
        }
        const treatments = await treatmentModel.getByNameStaff(name)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados por este miembro'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByLastNameStaff = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el apellido'
            })
        }
        const treatments = await treatmentModel.getByLastNameStaff(lastname)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados por este miembro'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
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
        const treatments = await treatmentModel.getByDocumentAthlete(document)
        if(treatments.length === 0){
            return res.status(404).json({       
                status:'Error',
                mensaje:'No hay tratamientos registrados para este atleta'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByNameAthlete = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre'
            })
        }           
        const treatments = await treatmentModel.getByNameAthlete(name)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados para este atleta'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByLastNameAthlete = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el apellido'
            })
        }
        const treatments = await treatmentModel.getByLastNameAthlete(lastname)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados para este atleta'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByStaffActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const existsStaff = await staffModel.getByUserId(id_user)
        if(!existsStaff){
            return res.status(403).json({
                status:'Error',
                mensaje:'No tienes permisos para ver tus tratamientos'
            })
        }
        const treatments = await treatmentModel.getByIdStaff(existsStaff.id_staff)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados por este miembro'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const getByAthletActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_athlete = id
        const treatments = await treatmentModel.getByIdAthlete(id_athlete)
        if(treatments.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay tratamientos registrados para este atleta'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            tratamientos:treatments
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los tratamientos'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const existsStaff = await staffModel.getByUserId(id_user)
        if(!existsStaff){
            return res.status(403).json({
                status:'Error',
                mensaje:'No tienes permisos para crear un tratamiento'
            })
        }
        const {id_injury,name, description, startDate, endDate, status} = req.body
        if(!id_injury || !name || !description || !startDate || !status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }
        const treatment = await treatmentModel.create(id_injury, existsStaff.id_staff, name, description, startDate, endDate, status)
        return res.status(201).json({
            status:'Success',
            mensaje:'Tratamiento creado exitosamente',
            tratamiento:treatment
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear el tratamiento'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_treatment = id
        const {endDate,status} = req.body
        if(!endDate || !status){
            return res.status(400).json({
                status:'Error', 
                mensaje:'Es requerida toda la informacion'
            })
        }
        const treatment = await treatmentModel.update(endDate,status, id_treatment)
        if(!treatment){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este tratamiento'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Tratamiento actualizado exitosamente',
            tratamiento:treatment
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el tratamiento'
        })
    }
}

const deleteTreatment = async(req,res)=>{
    try{
        const {id} = req.params
        const id_treatment = id
        const existsingTreatment = await treatmentModel.getById(id_treatment)
        if(!existsingTreatment){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este tratamiento'
            })
        }
        const treatment = await treatmentModel.deleteTreatment(id_treatment)
        
        return res.status(200).json({
            status:'Success',
            mensaje:'Tratamiento eliminado exitosamente',
            tratamiento:treatment
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo eliminar el tratamiento'
        })
    }
}
module.exports = {
    getAll,
    getById,
    getByDocumentStaff,
    getByNameStaff,
    getByLastNameStaff,
    getByDocumentAthlete,
    getByNameAthlete,
    getByLastNameAthlete,
    getByStaffActive,
    getByAthletActive,
    create,
    update,
    deleteTreatment
}