const pool = require('../config/db')

const getAll = async()=>{
    const result = await pool.query('SELECT * FROM categories')
    return result.rows
}

const getById = async(id_categorie)=>{
    const result = await pool.query('SELECT * FROM categories WHERE id_categorie = $1',[id_categorie])
    return result.rows[0]
}

const getByYear = async(parsedYear)=>{
    const year = Number.parseInt(parsedYear, 10)
    const result = await pool.query('SELECT * FROM categories WHERE EXTRACT(YEAR FROM year) = $1',[year])
    return result.rows
}

const create = async(name,minAge,maxAge,description,yearAsDate) =>{
    const result = await pool.query('INSERT INTO categories (name,minAge,maxAge,description,year) VALUES ($1,$2,$3,$4,$5) RETURNING *',[name,minAge,maxAge,description,yearAsDate])
    return result.rows[0]
}

const update = async(name,minAge,maxAge,description,yearAsDate,id_categorie) =>{
    const result = await pool.query('UPDATE categories SET name = $1, minAge = $2, maxAge = $3, description = $4, year = $5 WHERE id_categorie = $6 RETURNING *',[name,minAge,maxAge,description,yearAsDate,id_categorie])
    return result.rows[0]
}

const deleteCategorie = async(id_categorie)=>{
    const result = await pool.query('DELETE FROM categories WHERE id_categorie = $1 RETURNING *',[id_categorie])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByYear,
    create,
    update,
    deleteCategorie
}