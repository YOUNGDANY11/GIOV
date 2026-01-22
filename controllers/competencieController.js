const competencieModel = require('../models/competencieModel')

const getAll = async(req,res)=>{
    try{
        const competencies = await competencieModel.getAll()
        if(competencies.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay competencias registradas'
            })
        }

        return res.status(200).json({
            status:'Succes',
            mensaje:'Consulta exitosa',
            competencias:competencies
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener las competencias'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_competencie = id
        const competencie = await competencieModel.getById(id_competencie)
        if(!competencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta competencia'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            competencia:competencie
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener la competencia'
        })
    }
}

const getByCategorieName = async(req,res)=>{
    try{
        const {categorieName} = req.body
        if(!categorieName){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre de la categoria'
            })
        }
        const competencies = await competencieModel.getByCategorieName(categorieName)
        if(competencies.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay competencias asociadas a esta categoria'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            competencias:competencies
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener las competencias'
        })
    }
}

const getByName = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el nombre de la competencia'
            })
        }

        const competencies = await competencieModel.getByName(name)
        if(competencies.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay competencias asociadas con este nombre'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            competencias:competencies
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener las competencias'
        })
    }
}

const getByStatus = async(req,res)=>{
    try{
        const {status} = req.body
        if(!status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el estado de la competencia'
            })
        }

        const competencies = await competencieModel.getByStatus(status)
        if(competencies.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay competencias con este estado'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            competencias:competencies
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener las competencias'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id_categorie,name,description,startDate,finishDate,status} = req.body
        if(!id_categorie || !name || !description || !startDate || !finishDate || !status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const competencie = await competencieModel.create(id_categorie,name,description,startDate,finishDate,status)
        return res.status(200).json({
            status:'Success',
            mensaje:'Competencia creada con exito',
            competencia:competencie
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear la competencia'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_competencie = id
        const {id_categorie,name,description,startDate,finishDate,status} = req.body
        if(!id_categorie || !name || !description || !startDate || !finishDate || !status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta competencia'
            })
        }

        const competencie = await competencieModel.update(id_categorie,name,description,startDate,finishDate,status,id_competencie)
        return res.status(200).json({
            status:'Succes',
            mensaje:'Competencia actualizada con exito',
            competencia:competencie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar la competencia'
        })
    }
}

const deleteCompetencie = async(req,res)=>{
    try{
        const {id} = req.params
        const id_competencie = id
        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta competencia'
            })
        }

        const competencie = await competencieModel.deleteCompetencie(id_competencie)
        return res.status(200).json({
            status:'Succes',
            mensaje:'Competencia eliminada con exito',
            competencia:competencie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo eliminar la competencia'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByCategorieName,
    getByName,
    getByStatus,
    create,
    update,
    deleteCompetencie
}