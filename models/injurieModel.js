const pool = require('../config/db')

const baseSelect = `
    SELECT
        u.id_user AS user_id,
        a.id_athlete AS athlete_id,
        a.date AS athlete_date,
        u.document AS user_document,
        u.name AS user_name,
        u.lastname as user_lastname,
        i.*
    FROM injuries i
    INNER JOIN athletes a ON a.id_athlete = i.id_athlete
    INNER JOIN users u ON u.id_user = a.id_user
`

const getAll = async() => {
    const result = await pool.query(`${baseSelect} ORDER BY i.created_at DESC`)
    return result.rows
}

const getById = async(id_injury) => {
    const result = await pool.query(`${baseSelect} WHERE i.id_injury = $1`,[id_injury])
    return result.rows[0]
}

const getByIdAthlete = async(id_athlete)=>{
    const result = await pool.query(`${baseSelect} WHERE i.id_athlete = $1`,[id_athlete])
    return result.rows
}

const getByDocumentAthlete = async(document)=>{
    const result = await pool.query(`${baseSelect} WHERE u.document = $1 ORDER BY i.created_at DESC`,[document])
    return result.rows
}

const getByNameAthlete = async(name)=>{
    const result = await pool.query(`${baseSelect} WHERE u.name ILIKE $1 ORDER BY i.created_at DESC`, [`%${name}%`])
    return result.rows
}

const getByLastNameAthlete = async(lastname)=>{
    const result = await pool.query(`${baseSelect} WHERE u.lastname ILIKE $1 ORDER BY i.created_at DESC`, [`%${lastname}%`])
    return result.rows
}


const create = async(id_athlete,name,description,date,status) =>{
    const result = await pool.query('INSERT INTO injuries (id_athlete,name,description,date,status) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id_athlete,name,description,date,status])
    return result.rows[0]
}

const update = async(status,id_injury)=>{
    const result = await pool.query('UPDATE injuries SET status = $1 WHERE id_injury = $2 RETURNING *', [status,id_injury])
    return result.rows[0]
}

const deleteInjurie = async(id_injury)=>{
    const result = await pool.query('DELETE FROM injuries WHERE id_injury = $1 RETURNING *',[id_injury])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByIdAthlete,
    getByDocumentAthlete,
    getByNameAthlete,
    getByLastNameAthlete,
    create,
    update,
    deleteInjurie
}