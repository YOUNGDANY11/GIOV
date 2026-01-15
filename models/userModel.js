const pool = require('../config/db')

const getAll = async()=>{
    const result = await pool.query('SELECT * FROM users')
    return result.rows
}

const getById = async(id_user) =>{
    const result = await pool.query('SELECT * FROM users WHERE id_user = $1',[id_user])
    return result.rows[0]
}

const getByDocument = async(document)=>{
    const result = await pool.query('SELECT * FROM users WHERE document = $1',[document])
    return result.rows[0]
}

const getByName = async(name) =>{
    const result = await pool.query('SELECT * FROM users WHERE name ILIKE $1',[`%${name}%`])
    return result.rows
}

const getByLastName = async(lastname) =>{
    const result = await pool.query('SELECT * FROM users WHERE lastname ILIKE $1',[`%${lastname}%`])
    return result.rows
}

const create = async(name,lastname,document,hashedPassword,id_role) => {
    const result = await pool.query('INSERT INTO users (name,lastname,document,password,id_role) VALUES ($1,$2,$3,$4,$5) RETURNING *',[name,lastname,document,hashedPassword,id_role])
    return result.rows[0]
}

const update = async(name,lastname,document,hashedPassword,id_role,id_user) => {
    const result = await pool.query('UPDATE users SET name = $1, lastname = $2, document = $3, password = $4, id_role = $5, updated_at = NOW() WHERE id_user = $6 RETURNING *',[name,lastname,document,hashedPassword,id_role,id_user])
    return result.rows[0]
}

const updateImage = async(avatar, id_user) =>{
    const result = await pool.query('UPDATE users SET avatar = $1 WHERE id_user = $2 RETURNING *',[avatar,id_user])
    return result.rows[0]
}

const deleteUser = async(id_user) => {
    const result = await pool.query('DELETE FROM users WHERE id_user = $1 RETURNING *',[id_user])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByDocument,
    getByName,
    getByLastName,
    create,
    update,
    updateImage,
    deleteUser
}