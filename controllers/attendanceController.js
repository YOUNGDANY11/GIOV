const attendanceModel = require('../models/attendanceModel')
const athleteModel = require('../models/athleteModel')
const trainingModel = require('../models/trainingModel')

const parseTrainingStart = (training) => {
    const rawDate = training?.date
    const rawTime = training?.time

    let date = ''
    if (rawDate instanceof Date) {
        date = rawDate.toISOString().slice(0, 10)
    } else {
        date = String(rawDate ?? '').slice(0, 10)
    }

    let time = String(rawTime ?? '00:00:00')
    if (time.includes('.')) time = time.split('.')[0]
    if (time.length === 5) time = `${time}:00`

    if (!date) return null
    const dt = new Date(`${date}T${time}`)
    if (Number.isNaN(dt.getTime())) return null
    return dt
}

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
        const { id } = req.user
        const id_user = id

        const athlete = await athleteModel.getByUserId(id_user)
        if(!athlete){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este deportista'
            })
        }

        const {id_athlete,id_training,status} = req.body
        if(!id_training || !status){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        if(id_athlete && String(id_athlete) !== String(athlete.id_athlete)){
            return res.status(403).json({
                status:'Error',
                mensaje:'No puedes registrar asistencia para otro deportista'
            })
        }

        const training = await trainingModel.getById(id_training)
        if(!training){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este entrenamiento no esta registrado'
            })
        }

        // Default window aligns with the UI (2 hours).
        const windowMinutes = Number(process.env.ATTENDANCE_WINDOW_MINUTES || 120)
        const start = parseTrainingStart(training)
        if(!start){
            return res.status(400).json({
                status:'Error',
                mensaje:'No es posible validar la fecha/hora del entrenamiento'
            })
        }
        const end = new Date(start.getTime() + (windowMinutes * 60 * 1000))
        const now = new Date()
        if(now < start || now > end){
            return res.status(400).json({
                status:'Error',
                mensaje:'El registro de asistencia solo está disponible dentro de la ventana de tiempo del entrenamiento'
            })
        }

        const safeAthleteId = athlete.id_athlete
        const existsAttendance = await attendanceModel.getByAthleteAndTraining(safeAthleteId,id_training)
        if(existsAttendance){
            return res.status(400).json({
                status:'Error',
                mensaje:'Ya realizaste el registro de asistencia'
            })
        }

        const attendance = await attendanceModel.create(safeAthleteId,id_training,status)
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