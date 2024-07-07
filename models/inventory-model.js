const pool = require("../database/")

async function getClassifications() {
    try {
        const sql = "SELECT * FROM public.classification ORDER BY classification_name"
        return await pool.query(sql)
    } catch (error) {
        return error.message
    }
}

/*
* Get all items of a specific classification, aka list vehicles
*/
async function getItems(classification_id) {
    try {
        const sql = `SELECT * FROM public.inventory JOIN classification cl ON inventory.classification_id = cl.classification_id WHERE cl.classification_id = ${classification_id}`
        return await pool.query(sql)
    } catch (error) {
        return error.message
    }
}

/* 
 * Get the details of a specific item
*/
async function getDetails(id) {
    try {
        const sql = `SELECT * FROM public.inventory WHERE inv_id =  ${id}`
        return await pool.query(sql)
    } catch (error) {
        return error.message
    }
}

/*
* Check if a classification already exists
*/
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const className = await pool.query(sql, [classification_name])
        return className.rowCount
    } catch (error) {
        return error.message
    }
}

/*
 * Add a classification
*/
//INSERT INTO classification (classification_id, classification_name) VALUES
//(DEFAULT, 'classtest');
async function addClassification(classification_name) {
    try {
        const sql = `
        INSERT INTO classification (classification_id, classification_name) VALUES
        (DEFAULT, $1) RETURNING *`
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}
//                                      1               2           3           4           5           6           7           8           9           10
async function addItemToInventory(classification_id, inv_year, inv_make, inv_model, inv_image, inv_thumbnail, inv_miles, inv_color, inv_description, inv_price) {
    try {
        const sql = `INSERT INTO inventory (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES
        (DEFAULT, $3, $4, $2, $9, $5, $6, $10, $7, $8, $1) RETURNING *`
        await pool.query(sql, [classification_id, inv_year, inv_make, inv_model, inv_image, inv_thumbnail, inv_miles, inv_color, inv_description, inv_price])
        return true
    } catch (error) {
        return error.message, false
    }
}

module.exports = { 
    getClassifications, 
    getItems, 
    getDetails,
    checkExistingClassification,
    addClassification,
    addItemToInventory,
}