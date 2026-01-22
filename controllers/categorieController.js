const categorieModel = require('../models/categorieModel')

const getAll = async(req,res)=>{
    try{
        const categories = await categorieModel.getAll()
        if(categories.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay categorias creadas'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            categorias:categories
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las categorias'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_categorie = id
        const categorie = await categorieModel.getById(id_categorie)
        if(!categorie) {
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta categoria'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            categoria:categorie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la categoria'
        })
    }
}

const getByYear = async(req,res)=>{
    try{
        const {year} = req.body

        if(!year){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el año'
            })
        }

        const parsedYear = Number.parseInt(year, 10)
        if(Number.isNaN(parsedYear)){
            return res.status(400).json({
                status:'Error',
                mensaje:'El año no es válido'
            })
        }

        const categories = await categorieModel.getByYear(parsedYear)
        if(categories.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay categorias asignadas a este periodo o año'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            categorias:categories
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la categoria'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {name,minAge,maxAge,description,year} = req.body
        if(!name || !minAge || !maxAge || !description || !year){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const parsedYear = Number.parseInt(year, 10)
        if(Number.isNaN(parsedYear)){
            return res.status(400).json({
                status:'Error',
                mensaje:'El año no es válido'
            })
        }

        const yearAsDate = `${parsedYear}-01-01`

        const categorie = await categorieModel.create(name,minAge,maxAge,description,yearAsDate)
        return res.status(200).json({
            status:'Success',
            mensaje:'Categoria creada con exito',
            categoria:categorie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear la categoria'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_categorie = id
        const {name,minAge,maxAge,description,year} = req.body
        if(!name || !minAge || !maxAge || !description || !year){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const parsedYear = Number.parseInt(year, 10)
        if(Number.isNaN(parsedYear)){
            return res.status(400).json({
                status:'Error',
                mensaje:'El año no es válido'
            })
        }

        const yearAsDate = `${parsedYear}-01-01`

        const existsCategorie = await categorieModel.getById(id_categorie)
        if(!existsCategorie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta categoria'
            })
        }

        const categorie = await categorieModel.update(name,minAge,maxAge,description,yearAsDate,id_categorie)
        return res.status(200).json({
            status:'Success',
            mensaje:'Categoria actualizada con exito',
            categoria:categorie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible actualizar la categoria'
        })
    }
}

const deleteCategorie = async(req,res)=>{
    try{
        const {id} = req.params
        const id_categorie = id
        const existsCategorie = await categorieModel.getById(id_categorie)
        if(!existsCategorie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta categoria'
            })
        }

        const categorie = await categorieModel.deleteCategorie(id_categorie)
        return res.status(200).json({
            status:'Success',
            mensaje:'Categoria eliminada con exito',
            categoria:categorie
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar la categoria'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByYear,
    create,
    update,
    deleteCategorie
}