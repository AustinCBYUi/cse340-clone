const pool = require("../database/")

async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/*
* Get all items of a specific classification, aka list vehicles
*/
async function getItems(classification_id) {
    return await pool.query(`SELECT * FROM public.inventory JOIN classification cl ON inventory.classification_id = cl.classification_id WHERE cl.classification_id = ${classification_id}`)
};

/* 
 * Get the details of a specific item
*/
async function getDetails(id) {
    return await pool.query(`SELECT * FROM public.inventory WHERE inv_id =  ${id}`)
}

module.exports = { getClassifications, getItems, getDetails}