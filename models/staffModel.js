const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query(`SELECT  s.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM staff a INNER JOIN users u ON u.id_user = s.id_user`)
    return result.rows
}

const getById = async(id_staff) =>{
    const result = await pool.query(`SELECT  s.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM staff a INNER JOIN users u ON u.id_user = s.id_user WHERE s.id_staff = $1`, [id_staff])
    return result.rows[0]
}

const getByUserId = async(id_user) =>{
    const result = await pool.query(`SELECT  s.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM staff a INNER JOIN users u ON u.id_user = s.id_user WHERE s.id_user = $1`,[id_user])
    return result.rows[0]
}

const getByUserDocument = async(document) =>{
    const result = await pool.query(`SELECT  s.*, u.name AS name, u.lastname AS lastname, u.document AS document FROM staff a INNER JOIN users u ON u.id_user = s.id_user WHERE u.document = $1`, [document])
    return result.rows[0]
}

const create = async(id_user,date,address,blood_type,information,description) => {
    const result = await pool.query('INSERT INTO staff (id_user,date,address,blood_type,information,description) VALUES ($1,$2,$3,$4,$5,$6) RETURNINIG *',[id_user,date,address,blood_type,information,description])
    return result.rows[0]
}

const update = async(date,address,blood_type,information,description,id_staff) => {
    const result = await pool.query('UPDATE staff SET date = $1, address = $2, blood_type = $3, information = $4, description = $5 WHERE id_staff = $6 RETURNING *',[date,address,blood_type,information,description,id_staff])
    return result.rows[0]
}

const updateByStaff = async(date,address,blood_type,information,description,id_user) => {
    const result = await pool.query('UPDATE staff SET date = $1, address = $2, blood_type = $3, information = $4, description = $5 WHERE id_user = $6 RETURNING *',[date,address,blood_type,information,description,id_user])
    return result.rows[0]
}

const deleteStaff = async(id_staff)=>{
    const result = await pool.query('DELETE FROM staff WHERE id_staff = $1 RETURNING *',[id_staff])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByUserDocument,
    create,
    update,
    updateByStaff,
    deleteStaff
}