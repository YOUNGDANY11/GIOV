const attendanceModel = require('../models/attendanceModel')
const athleteModel = require('../models/athleteModel')
const getAll = async(req,res)=>{
    try{
        const attendances = await attendanceModel.getAll()
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias registradas'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params

        const id_attendance = id
        const attendance = await attendanceModel.getById(id_attendance)
        if(!attendance){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta asitencia'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendance
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener la asistencia'
        })
    }
}

const getByIdTraining = async(req,res)=>{
    try{   
        const {id} = req.params
        const id_training = id
        const attendances = await attendanceModel.getByIdTraining(id_training)
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias registradas'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias'
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
        const attendances = await attendanceModel.getByNameAthlete(name)
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias registradas'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias'
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
        const attendances = await attendanceModel.getByLastNameAthlete(lastname)
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias registradas'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias'
        })
    }
}

const getByStatus = async(req,res)=>{
    try{   
        const {status} = req.body
        if(!status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el estado de la asistencia'
            })
        }
        const attendances = await attendanceModel.getByStatus(status)
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias registradas'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias'
        })
    }
}

const getByAthleteActive = async(req,res)=>{
    try{   
        const {id} = req.user
        const id_user = id
        const existsAthlete = await athleteModel.getByUserId(id_user)
        if(!existsAthlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }
        const attendances = await attendanceModel.getByAthleteActive(existsAthlete.id_athlete)
        if(attendances.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay asistencias activas registradas'
            })
        }
        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            asistencias:attendances
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible obtener las asistencias activas'
        })
    }
}

const create = async(req,res)=>{
    try{
        const {id_athlete,id_training,status} = req.body
        if(!id_athlete || !id_training || !status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }
        const existsAttendance = await attendanceModel.getByAthleteAndTraining(id_athlete,id_training)
        if(existsAttendance){
            return res.status(400).json({
                status:'Error',
                mensaje:'Ya realizaste el registro de asistencia'
            })
        }
        const attendance = await attendanceModel.create(id_athlete,id_training,status)
        return res.status(200).json({
            status:'Success',
            mensaje:'Asistencia creada con exito',
            asistencia:attendance
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible crear la asistencia'
        })
    }
}

const deleteAttendance = async(req,res)=>{
    try{
        const {id} = req.params
        const id_attendance = id
        const existsAttendance = await attendanceModel.getById(id_attendance)
        if(!existsAttendance){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe esta asistencia'
            })
        }

        const attendance = await attendanceModel.deleteAttendance(id_attendance)
        return res.status(200).json({
            status:'Success',
            mensaje:'Asistencia eliminada con exito',
            asistencia:attendance
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No es posible eliminar la asistencia'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByIdTraining,
    getByNameAthlete,
    getByLastNameAthlete,
    getByStatus,
    getByAthleteActive,
    create,
    deleteAttendance
}