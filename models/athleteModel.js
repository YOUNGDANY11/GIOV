const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user`)
    return result.rows
}

const getById = async(id_athlete) =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE a.id_athlete = $1`, [id_athlete])
    return result.rows[0]
}

const getByUserId = async(id_user) =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE a.id_user = $1`,[id_user])
    return result.rows[0]
}

const getByUserDocument = async(document) =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE u.document = $1`, [document])
    return result.rows[0]
}

const getByDate = async(year)=>{
    const birthYear = Number.parseInt(year, 10)
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE EXTRACT(YEAR FROM a.date) = $1`,[birthYear])
    return result.rows
}

const getByStature = async(stature) =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE a.stature::text ILIKE $1`, [`%${stature}%`])
    return result.rows
}

const getByFoot = async(foot) =>{
    const result = await pool.query(`SELECT  a.*, u.name AS name, u.lastname AS lastname, u.document AS user_document FROM athletes a INNER JOIN users u ON u.id_user = a.id_user WHERE a.foot ILIKE $1`,[`%${foot}%`])
    return result.rows
}

const create = async(id_user,date,foot,address,blood_type,stature)=>{
    const result = await pool.query('INSERT INTO athletes (id_user,date,foot,address,blood_type,stature) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[id_user,date,foot,address,blood_type,stature])
    return result.rows[0]
}

const update = async(date,foot,address,blood_type,stature,id_athlete) =>{
    const result = await pool.query('UPDATE athletes SET date = $1, foot = $2, address = $3, blood_type = $4, stature = $5 WHERE id_athlete = $6 RETURNING *',[date,foot,address,blood_type,stature,id_athlete])
    return result.rows[0]
}

const updateByAthlete = async(address,stature,foot,id_user) => {
    const result = await pool.query('UPDATE athletes SET address = $1, stature = $2, foot = $3 WHERE id_user = $4 RETURNING *',[address,stature,foot,id_user])
    return result.rows[0]
}

const deleteAthlete = async(id_athlete)=>{
    const result = await pool.query('DELETE FROM athletes WHERE id_athlete = $1 RETURNING *',[id_athlete])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByUserDocument,
    getByDate,
    getByStature,
    getByFoot,
    create,
    update,
    updateByAthlete,
    deleteAthlete
}