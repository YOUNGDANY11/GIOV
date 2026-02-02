const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user`)
    return result.rows
}

const getById = async(id_relative) =>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE r.id_relative = $1`, [id_relative])
    return result.rows[0]
}

const getByUserId = async(id_user) =>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE r.id_user = $1`,[id_user])
    return result.rows
}

const getByAthleteDocument = async(document) =>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE u.document = $1`, [document])
    return result.rows
}

const getByDocument = async(document) => {
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE r.document = $1`, [document])
    return result.rows[0]
}

const getByName = async(name)=>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE r.name ILIKE $1`, [`%${name}%`])
    return result.rows
}

const getByLastName = async(lastname)=>{
    const result = await pool.query(`SELECT  r.*, u.name AS athlete_name, u.lastname AS athlete_lastname, u.document AS athlete_document FROM relatives r INNER JOIN users u ON u.id_user = r.id_user WHERE r.lastname ILIKE $1`, [`%${lastname}%`])
    return result.rows
}

const create = async(id_user,name,lastname,document,email,country,deparment,city, type, contact) =>{
    const result = await pool.query('INSERT INTO relatives (id_user,name,lastname,document,email,country,deparment,city,type,contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',[id_user,name,lastname,document,email,country,deparment,city,type,contact])
    return result.rows[0]
}

const update = async(name,lastname,document,email,country,deparment,city,type,contact,id_relative)=>{
    const result = await pool.query('UPDATE relatives SET name = $1, lastname = $2, document = $3, email = $4, country = $5, deparment = $6, city = $7, type = $8, contact = $9 WHERE id_relative = $10 RETURNING *',[name,lastname,document,email,country,deparment,city,type,contact,id_relative])
    return result.rows[0]
}

const deleteRelative = async(id_relative)=>{
    const result = await pool.query('DELETE FROM relatives WHERE id_relative = $1 RETURNING *',[id_relative])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByAthleteDocument,
    getByDocument,
    getByName,
    getByLastName,
    create,
    update,
    deleteRelative
}