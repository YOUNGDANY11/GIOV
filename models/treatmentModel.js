const pool = require('../config/db')

const baseSelect = `
    SELECT
        us.id_user AS staff_user_id,
        s.id_staff AS staff_id,
        us.document AS staff_document,
        us.name AS staff_name,
        us.lastname AS staff_lastname,

        ua.id_user AS athlete_user_id,
        a.id_athlete AS athlete_id,
        a.date AS athlete_date,
        ua.document AS athlete_document,
        ua.name AS athlete_name,
        ua.lastname AS athlete_lastname,

        i.id_injury AS injury_id,
        i.name AS injury_name,
        i.description AS injury_description,
        i.date AS injury_date,
        i.status AS injury_status,

        t.*
    FROM treatments t
    INNER JOIN injuries i ON i.id_injury = t.id_injury
    INNER JOIN athletes a ON a.id_athlete = i.id_athlete
    INNER JOIN users ua ON ua.id_user = a.id_user
    INNER JOIN staff s ON s.id_staff = t.id_staff
    INNER JOIN users us ON us.id_user = s.id_user
`


const getAll = async() => {
    const result = await pool.query(`${baseSelect} ORDER BY t.created_at DESC`)
    return result.rows
}

const getById = async(id_treatment) => {
    const result = await pool.query(`${baseSelect} WHERE t.id_treatment = $1`, [id_treatment])
    return result.rows[0]
}

const getByIdInjury = async(id_injury) => {
    const result = await pool.query(`${baseSelect} WHERE t.id_injury = $1 ORDER BY t.created_at DESC`, [id_injury])
    return result.rows
}

const getByIdStaff = async(id_staff)=>{
    const result = await pool.query(`${baseSelect} WHERE t.id_staff = $1 ORDER BY t.created_at DESC`, [id_staff])
    return result.rows
}

const getByDocumentStaff = async(document)=>{
    const result = await pool.query(`${baseSelect} WHERE us.document = $1 ORDER BY t.created_at DESC`, [document])
    return result.rows
}

const getByNameStaff = async(name)=>{
    const result = await pool.query(`${baseSelect} WHERE us.name ILIKE $1 ORDER BY t.created_at DESC`, [`%${name}%`])
    return result.rows
}

const getByLastNameStaff = async(lastname)=>{
    const result = await pool.query(`${baseSelect} WHERE us.lastname ILIKE $1 ORDER BY t.created_at DESC`, [`%${lastname}%`])
    return result.rows
}

const getByIdAthlete = async(id_athlete)=>{
    const result = await pool.query(`${baseSelect} WHERE a.id_athlete = $1 ORDER BY t.created_at DESC`, [id_athlete])
    return result.rows
}

const getByDocumentAthlete = async(document)=>{
    const result = await pool.query(`${baseSelect} WHERE ua.document = $1 ORDER BY t.created_at DESC`, [document])
    return result.rows
}

const getByNameAthlete = async(name)=>{
    const result = await pool.query(`${baseSelect} WHERE ua.name ILIKE $1 ORDER BY t.created_at DESC`, [`%${name}%`])
    return result.rows
}

const getByLastNameAthlete = async(lastname)=>{
    const result = await pool.query(`${baseSelect} WHERE ua.lastname ILIKE $1 ORDER BY t.created_at DESC`, [`%${lastname}%`])
    return result.rows
}


const create = async(id_injury, id_staff, name, description, startDate, endDate, status) => {
    const result = await pool.query('INSERT INTO treatments (id_injury, id_staff, name, description, startDate, endDate, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',[id_injury, id_staff, name, description, startDate, endDate ?? null, status])
    return result.rows[0]
}

const update = async(endDate,status, id_treatment) => {
    const result = await pool.query('UPDATE treatments SET endDate = $1, status = $2 WHERE id_treatment = $3 RETURNING *', [endDate,status,id_treatment])
    return result.rows[0]
}

const deleteTreatment = async(id_treatment) => {
    const result = await pool.query('DELETE FROM treatments WHERE id_treatment = $1 RETURNING *', [id_treatment])
    return result.rows[0]
}
module.exports = {
    getAll,
    getById,
    getByIdInjury,
    getByIdStaff,
    getByDocumentStaff,
    getByNameStaff,
    getByLastNameStaff,
    getByIdAthlete,
    getByDocumentAthlete,
    getByNameAthlete,
    getByLastNameAthlete,
    create,
    update,
    deleteTreatment,
}