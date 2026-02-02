const pool = require('../config/db')
const { get } = require('../routes/athleteInCompetencieRoutes')

const attendanceViewSelect = `
    SELECT
        at.*,
        u.name AS athlete_name,
        u.lastname AS athlete_lastname,
        t.name AS training_name,
        t.date AS training_date,
        t.time AS training_time,
        t.location AS training_location
    FROM attendances at
    INNER JOIN athletes a ON a.id_athlete = at.id_athlete
    INNER JOIN users u ON u.id_user = a.id_user
    INNER JOIN trainings t ON t.id_training = at.id_training
`

const getAll = async() =>{
    const result = await pool.query(`${attendanceViewSelect} ORDER BY at.created_at DESC`)
    return result.rows
}

const getById = async(id_attendance) =>{
    const result = await pool.query(`${attendanceViewSelect} WHERE at.id_attendance = $1`,[id_attendance])
    return result.rows[0]
}

const getByIdTraining = async(id_training)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE at.id_training = $1 ORDER BY at.created_at DESC`,[id_training])
    return result.rows
}

const getByNameAthlete = async(name)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE u.name ILIKE $1 ORDER BY at.created_at DESC`,[`%${name}%`])
    return result.rows
}

const getByLastNameAthlete = async(name)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE u.lastname ILIKE $1 ORDER BY at.created_at DESC`,[`%${name}%`])
    return result.rows
}

const getByStatus = async(status)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE at.status = $1 ORDER BY at.created_at DESC`,[status])
    return result.rows
}

const getByAthleteAndTraining = async(id_athlete,id_training)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE at.id_athlete = $1 AND at.id_training = $2`,[id_athlete,id_training])
    return result.rows[0]
}

const getByAthleteActive = async(id_athlete)=>{
    const result = await pool.query(`${attendanceViewSelect} WHERE at.id_athlete = $1 AND at.status = $2`,[id_athlete,'Verificado'])
    return result.rows
}

const create = async(id_athlete,id_training,status)=>{
    const result = await pool.query('INSERT INTO attendances (id_athlete,id_training,status) VALUES ($1,$2,$3) RETURNING *',[id_athlete,id_training,status])
    return result.rows[0]
}

const deleteAttendance = async(id_attendance)=>{
    const result = await pool.query('DELETE FROM attendances WHERE id_attendance = $1 RETURNING *',[id_attendance])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByIdTraining,
    getByNameAthlete,
    getByLastNameAthlete,
    getByStatus,
    getByAthleteAndTraining,
    getByAthleteActive,
    create,
    deleteAttendance
}

