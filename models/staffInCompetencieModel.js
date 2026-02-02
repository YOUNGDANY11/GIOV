const pool = require('../config/db')

const baseSelect = `
    SELECT
        sic.*,
        u.id_user AS user_id,
        s.id_staff AS staff_id,
        s.date AS staff_date,
        s.address AS staff_address,
        s.blood_type AS staff_blood_type,
        s.information AS staff_information,
        s.description AS staff_description,
        u.document AS user_document,
        u.name AS user_name,
        u.lastname AS user_lastname,
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
    FROM staff_in_competencies sic
    INNER JOIN staff s ON s.id_staff = sic.id_staff
    INNER JOIN users u ON u.id_user = s.id_user
    INNER JOIN competencies co ON co.id_competencie = sic.id_competencie
    INNER JOIN categories c ON c.id_categorie = co.id_categorie
`

const getAll = async() => {
    const result = await pool.query(`${baseSelect} ORDER BY sic.created_at DESC`)
    return result.rows
}

const getById = async(id_staff_comp) => {
    const result = await pool.query(`${baseSelect} WHERE sic.id_staff_comp = $1`,[id_staff_comp])
    return result.rows[0]
}

const getByDocumentStaff = async(document)=>{
    const result = await pool.query(`${baseSelect} WHERE u.document = $1 ORDER BY sic.created_at DESC`,[document])
    return result.rows
}

const getByNameStaff = async(name)=>{
    const result = await pool.query(`${baseSelect} WHERE u.name ILIKE $1 ORDER BY sic.created_at DESC`, [`%${name}%`])
    return result.rows
}

const getByLastNameStaff = async(lastname)=>{
    const result = await pool.query(`${baseSelect} WHERE u.lastname ILIKE $1 ORDER BY sic.created_at DESC`, [`%${lastname}%`])
    return result.rows
}

const getStaffInCompetencieActive = async(id_staff, id_competencie) =>{
    const result = await pool.query('SELECT * FROM staff_in_competencies WHERE id_staff = $1 AND id_competencie = $2',[id_staff,id_competencie])
    return result.rows
}

const create = async(id_staff, id_competencie) =>{
    const result = await pool.query('INSERT INTO staff_in_competencies (id_staff,id_competencie) VALUES ($1,$2) RETURNING *',[id_staff, id_competencie])
    return result.rows[0]
}

const update = async(id_staff, id_competencie, id_staff_comp)=>{
    const result = await pool.query('UPDATE staff_in_competencies SET id_staff = $1, id_competencie = $2 WHERE id_staff_comp = $3 RETURNING *', [id_staff, id_competencie, id_staff_comp])
    return result.rows[0]
}

const deleteStaffInComp = async(id_staff_comp)=>{
    const result = await pool.query('DELETE FROM staff_in_competencies WHERE id_staff_comp = $1 RETURNING *',[id_staff_comp])
    return result.rows[0]
}

module.exports = {
    getAll,
    getById,
    getByDocumentStaff,
    getByNameStaff,
    getByLastNameStaff,
    getStaffInCompetencieActive,
    create,
    update,
    deleteStaffInComp
}