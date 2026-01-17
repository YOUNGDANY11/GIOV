const pool = require('../config/db')

const getAll = async() =>{
    const result = await pool.query(
        `SELECT 
            d.*,
            u.name AS user_name,
            u.lastname AS user_lastname,
            u.document AS user_document
        FROM documents d
        INNER JOIN users u ON u.id_user = d.id_user`
    )
    return result.rows
}

const getById = async(id_document) =>{
    const result = await pool.query(
        `SELECT 
            d.*,
            u.name AS user_name,
            u.lastname AS user_lastname,
            u.document AS user_document
        FROM documents d
        INNER JOIN users u ON u.id_user = d.id_user
        WHERE d.id_document = $1`,
        [id_document]
    )
    return result.rows[0]
}

const getByUserId = async(id_user)=>{
    const result = await pool.query(
        `SELECT 
            d.*,
            u.name AS user_name,
            u.lastname AS user_lastname,
            u.document AS user_document
        FROM documents d
        INNER JOIN users u ON u.id_user = d.id_user
        WHERE d.id_user = $1`,
        [id_user]
    )
    return result.rows
}

const getByUserDocument = async(document) => {
    const result = await pool.query(
        `SELECT 
            d.*,
            u.name AS user_name,
            u.lastname AS user_lastname,
            u.document AS user_document
        FROM documents d
        INNER JOIN users u ON u.id_user = d.id_user
        WHERE u.document = $1`,
        [document]
    )
    return result.rows
}

const create = async(id_user,name,description, document) =>{
    const result = await pool.query('INSERT INTO documents (id_user,name,description,document) VALUES ($1,$2,$3,$4) RETURNING *',[id_user,name,description, document])
    return result.rows[0]
}

const update = async(name,description,document,id_document) => {
    const result = await pool.query('UPDATE documents SET name = $1, description = $2, document = $3, updated_at = NOW() WHERE id_document = $4 RETURNING *',[name,description,document,id_document])
    return result.rows[0]
}

const deleteDocument = async(id_document) => {
    const result = await pool.query('DELETE FROM documents WHERE id_document = $1 RETURNING *',[id_document])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByUserDocument,
    create,
    update,
    deleteDocument
}