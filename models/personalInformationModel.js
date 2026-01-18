const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query(`SELECT  p.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM personal_information p INNER JOIN users u ON u.id_user = p.id_user`)
    return result.rows
}

const getById = async(id_staff) =>{
    const result = await pool.query(`SELECT  p.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM personal_information p INNER JOIN users u ON u.id_user = p.id_user WHERE p.id_staff = $1`, [id_staff])
    return result.rows[0]
}

const getByUserId = async(id_user) =>{
    const result = await pool.query(`SELECT  p.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM personal_information p INNER JOIN users u ON u.id_user = p.id_user WHERE p.id_user = $1`,[id_user])
    return result.rows[0]
}

const getByUserDocument = async(document) =>{
    const result = await pool.query(`SELECT  p.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM personal_information p INNER JOIN users u ON u.id_user = p.id_user WHERE u.document = $1`, [document])
    return result.rows[0]
}

const create = async(id_user,country,deparment,city,email) =>{
    const result = await pool.query('INSERT INTO personal_information (id_user,country,deparment,city,email) VALUES ($1,$2,$3,$4,$5) RETURNING *',[id_user,country,deparment,city,email])
    return result.rows[0]
}

const update = async(country,deparment,city,email,id_per_inf)=>{
    const result = await pool.query('UPDATE personal_information SET country = $1, deparment = $2, city = $3, email = $4 WHERE id_per_inf = $5 RETURNING *',[country,deparment,city,email,id_per_inf])
    return result.rows[0]
}

const deletePersonalInformation = async(id_per_inf) =>{
    const result = await pool.query('DELETE FROM personal_information WHERE id_per_inf = $1 RETURNING *',[id_per_inf])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByUserDocument,
    create,
    update,
    deletePersonalInformation
}