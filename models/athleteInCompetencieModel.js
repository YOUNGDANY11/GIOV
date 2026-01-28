const pool = require('../config/db')

const baseSelect = `
    SELECT
        aic.*,
        u.id_user AS user_id,
        a.id_athlete AS athlete_id,
        a.date AS athlete_date,
        u.document AS user_document,
        u.name AS user_name,
        u.lastname as user_lastname,
        co.id_competencie AS competencie_id,
        co.id_categorie AS competencie_categorie,
        co.name AS competencie_name,
        co.description AS competencie_description,
        co.status AS competencie_status,
        c.id_categorie AS categorie_id,
        c.name AS categorie_name,
        c.minAge AS categorie_minage,
        c.maxAge AS categorie_maxage,
        c.description AS categorie_description,
        c.year AS categorie_year
    FROM athletes_in_competencies aic
    INNER JOIN athletes a ON a.id_athlete = aic.id_athlete
    INNER JOIN users u ON u.id_user = a.id_user
    INNER JOIN competencies co ON co.id_competencie = aic.id_competencie
    INNER JOIN categories c ON c.id_categorie = co.id_categorie
`

const getAll = async() => {
    const result = await pool.query(`${baseSelect} ORDER BY aic.created_at DESC`)
    return result.rows
}

const getById = async(id_ath_comp) => {
    const result = await pool.query(`${baseSelect} WHERE aic.id_ath_comp = $1`,[id_ath_comp])
    return result.rows[0]
}

const getByDocumentAthlete = async(document)=>{
    const result = await pool.query(`${baseSelect} WHERE u.document = $1 ORDER BY aic.created_at DESC`,[document])
    return result.rows
}

const getAthleteInCompetencieActive = async(id_athlete, id_competencie) =>{
    const result = await pool.query('SELECT * FROM athletes_in_competencies WHERE id_athlete = $1 AND id_competencie = $2',[id_athlete,id_competencie])
    return result.rows
}

const create = async(id_athlete, id_competencie) =>{
    const result = await pool.query('INSERT INTO athletes_in_competencies (id_athlete,id_competencie) VALUES ($1,$2) RETURNING *',[id_athlete, id_competencie])
    return result.rows[0]
}

const update = async(id_athlete, id_competencie,id_ath_comp)=>{
    const result = await pool.query('UPDATE athletes_in_competencies SET id_athlete = $1, id_competencie = $2 WHERE id_ath_comp = $3 RETURNING *', [id_athlete, id_competencie,id_ath_comp])
    return result.rows[0]
}

const deleteAthlInComp = async(id_ath_comp)=>{
    const result = await pool.query('DELETE FROM athletes_in_competencies WHERE id_ath_comp = $1 RETURNING *',[id_ath_comp])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByDocumentAthlete,
    getAthleteInCompetencieActive,
    create,
    update,
    deleteAthlInComp
}