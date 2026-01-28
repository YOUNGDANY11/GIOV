const athInCompModel = require('../models/athleteInCompetencieModel')
const athleteModel = require('../models/athleteModel')
const competencieModel = require('../models/competencieModel')

const getAll = async(req,res)=>{
    try{
        const athInComp = await athInCompModel.getAll()
        if(athInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay atletas registrados en competencia'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            atletas:athInComp
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener los atletas en competencia'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_ath_comp = id
        const athInComp = await athInCompModel.getById(id_ath_comp)
        if(!athInComp){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este registro'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            atleta:athInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el atleta en competencia'
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

        const athInComp = await athInCompModel.getByDocumentAthlete(document)
        if(athInComp.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe registro de competencia de este deportista'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            atleta:athInComp
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener el atleta en competencia'
        })
    }
}

const create =  async(req,res)=>{
    try{
        const {id_athlete,id_competencie} = req.body
        if(!id_athlete || !id_competencie){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsAthlete = await athleteModel.getById(id_athlete)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const validAthInComp = await athInCompModel.getAthleteInCompetencieActive(id_athlete,id_competencie)
        if(validAthInComp.length >= 1){
            return res.status(400).json({
                status:'Error',
                mensaje:'Este deportista ya esta asociado a la competencia'
            })
        }

        const athInComp = await athInCompModel.create(id_athlete,id_competencie)
        return res.status(200).json({
            status:'Success',
            mensaje:'Asignacion de competencia ha sido exitosa',
            athInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear el atleta en competencia'
        })
    }
}

const update  = async(req,res)=>{
    try{    
        const {id} = req.params
        const id_ath_comp = id
        const {id_athlete,id_competencie} = req.body
        if(!id_athlete || !id_competencie){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsAthlete = await athleteModel.getById(id_athlete)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const existsCompetencie = await competencieModel.getById(id_competencie)
        if(!existsCompetencie){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const validAthInComp = await athInCompModel.getAthleteInCompetencieActive(id_athlete,id_competencie)
        if(validAthInComp.length >= 1){
            return res.status(400).json({
                status:'Error',
                mensaje:'Este deportista ya esta asociado a la competencia'
            })
        }

        const athInComp = await athInCompModel.update(id_athlete,id_competencie,id_ath_comp)
        return res.status(200).json({
            status:'Success',
            mensaje:'Actualizado con exito',
            atleta:athInComp
        })

    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible actualizar el atleta en competencia'
        })
    }
}

const deleteAthlInComp = async(req,res)=>{
    try{
        const {id} = req.params
        const id_ath_comp = id

        const existsAthInCom = await athInCompModel.getById(id_ath_comp)
        if(!existsAthInCom){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este registro'
            })
        }

        const athInComp = await athInCompModel.deleteAthlInComp(id_ath_comp)
        return res.status(200).json({
            status:'Success',
            mensaje:'El deportista ha sido eliminado de esta competencia de forma exitosa',
            atleta:athInComp
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar el atleta en competencia'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByDocumentAthlete,
    create,
    update,
    deleteAthlInComp
}