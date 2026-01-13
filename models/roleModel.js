const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query('SELECT * FROM roles')
    return result.rows
}

const getById = async(id_role) =>{
    const result = await pool.query('SELECT * FROM roles WHERE id_role = $1',[id_role])
    return result.rows[0]
}

const create = async(name,code) =>{
    const result = await pool.query('INSERT INTO roles (name,code) VALUES ($1,$2) RETURNING *',[name,code])
    return result.rows[0]
}

const deleteRole = async(id_role) => {
    const result = await pool.query('DELETE FROM roles WHERE id_role = $1 RETURNING *',[id_role])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    create,
    deleteRole
}