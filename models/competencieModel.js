const pool = require('../config/db')

const getAll = async()=>{
    const result = await pool.query(`SELECT co.*, c.id_categorie AS categorie_id, c.name AS categorie_name, c.minAge AS categorie_minage, c.maxAge AS categorie_maxage, c.description AS categorie_description, c.year AS categorie_year FROM competencies co INNER JOIN categories c ON c.id_categorie = co.id_categorie`)
    return result.rows
}

const getById = async(id_competencie) => {
    const result = await pool.query(`SELECT co.*, c.id_categorie AS categorie_id, c.name AS categorie_name, c.minAge AS categorie_minage, c.maxAge AS categorie_maxage, c.description AS categorie_description, c.year AS categorie_year FROM competencies co INNER JOIN categories c ON c.id_categorie = co.id_categorie WHERE co.id_competencie = $1`,[id_competencie])
    return result.rows[0]
}

const getByCategorieName = async(categorieName) =>{
    const result = await pool.query(`SELECT co.*, c.id_categorie AS categorie_id, c.name AS categorie_name, c.minAge AS categorie_minage, c.maxAge AS categorie_maxage, c.description AS categorie_description, c.year AS categorie_year FROM competencies co INNER JOIN categories c ON c.id_categorie = co.id_categorie WHERE c.name ILIKE $1 ORDER BY co.startDate DESC`,[categorieName])
    return result.rows
}

const getByName = async(name) =>{
    const result = await pool.query(`SELECT co.*, c.id_categorie AS categorie_id, c.name AS categorie_name, c.minAge AS categorie_minage, c.maxAge AS categorie_maxage, c.description AS categorie_description, c.year AS categorie_year FROM competencies co INNER JOIN categories c ON c.id_categorie = co.id_categorie WHERE co.name ILIKE $1`,[`%${name}%`])
    return result.rows
}

const getByStatus = async(status)=>{
    const result = await pool.query(`SELECT co.*, c.id_categorie AS categorie_id, c.name AS categorie_name, c.minAge AS categorie_minage, c.maxAge AS categorie_maxage, c.description AS categorie_description, c.year AS categorie_year FROM competencies co INNER JOIN categories c ON c.id_categorie = co.id_categorie WHERE co.status = $1`,[status])
    return result.rows
}

const create = async(id_categorie,name,description,startDate,finishDate,status)=>{
    const result = await pool.query('INSERT INTO competencies (id_categorie,name,description,startDate,finishDate, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[id_categorie,name,description,startDate,finishDate,status])
    return result.rows[0]
}

const update = async(id_categorie,name,description,startDate,finishDate,status, id_competencie)=>{
    const result = await pool.query('UPDATE competencies SET id_categorie = $1, name = $2, description = $3, startDate  = $4, finishDate = $5, status = $6 WHERE id_competencie = $7 RETURNING *',[id_categorie,name,description,startDate,finishDate,status, id_competencie])
    return result.rows[0]
}

const deleteCompetencie = async(id_competencie) =>{
    const result = await pool.query('DELETE FROM competencies WHERE id_competencie = $1 RETURNING *',[id_competencie])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByCategorieName,
    getByName,
    getByStatus,
    create,
    update,
    deleteCompetencie
}