const pool = require('../config/db')

const getAll = async() => {
    const result = await pool.query('SELECT * FROM  athletes_in_competencies')
    return result.rows
}

const getById = async(id_ath_comp) => {
    const result = await pool.query('SELECT * FROM  athletes_in_competencies WHERE id_ath_comp = $1',[id_ath_comp])
    return result.rows[0]
}

const getByDocumentAthlete = async(document)=>{
    const result = await pool.query(`SELECT aic.*, a.id_athlete AS athlete_id, u.id_user AS user_id, u.document AS user_document, u.name AS user_name, u.lastname AS user_lastname, co.id_competencie AS competencie_id, co.name AS competencie_name, co.description AS competencie_description, co.startDate AS competencie_startdate, co.finisDate AS competencie_finishdate, co.status AS competencie_status FROM athletes_in_competencies aic INNER JOIN athletes a ON a.id_athlete = aic.id_athlete INNER JOIN users u ON u.id_user = a.id_user INNER JOIN competencies co ON co.id_competencie = aic.id_competencie WHERE u.document = $1 ORDER BY aic.created_at DESC`,[document])
    return result.rows
}

module.exports = {
    getAll,
    getById,
    getByDocumentAthlete
}