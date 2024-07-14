const pool = require("../database/")

/* ***********************
* Inventory Model is used to interact with the database.
* This is where the SQL queries are written and executed.
* The controller will call these functions to interact with the database.
*************************/



/* ***********************
* Gets the classifications from the classification table.
*************************/
async function getClassifications() {
    try {
        const sql = "SELECT * FROM public.classification ORDER BY classification_name"
        return await pool.query(sql)
    } catch (error) {
        return error.message
    }
}


/* ***********************
* Get all items in the inventory table.
* rows parameter is optional. If true, it will return the rows.
* This is used for the JSON response issues I was running into.
* It is defaulted to false because the initial use is for the details page.
*************************/
async function getItems(classification_id, rows = false) {
    try {
        const sql = `SELECT * FROM inventory WHERE classification_id = ${classification_id}`
        const inject = await pool.query(sql)
        if (rows) {
            return inject.rows
        } else {
            return inject
        }
    } catch (error) {
        return error.message
    }
}


/* ***********************
* Get the details of an individual item by the ID.
* rows parameter is optional. If true, it will return the rows.
* This is used for the JSON response issues I was running into.
* It is defaulted to false because the initial use is for the details page.
*************************/
async function getDetails(id, rows = false) {
    try {
        const sql = `SELECT * FROM inventory WHERE inv_id =  ${id}`
        const inject = await pool.query(sql)
        if (rows) {
            return inject.rows
        } else {
            return inject
        }
    } catch (error) {
        return error.message
    }
}


/* ***********************
* Check if a classification already exists.
*************************/
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const className = await pool.query(sql, [classification_name])
        return className.rowCount
    } catch (error) {
        return error.message
    }
}


/* ***********************
* Adds a new classification to the classification table.
*************************/
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
/* ***********************
* Adds an item to the inventory table / db.
*************************/
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

/* ***********************
* Updates the contents of an item in the inventory table / db.
*************************/
async function updateItemInInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = "UPDATE inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("Model error: " + error)
    }
}


/* ***********************
* Deletes an item from the inventory table.
*************************/
async function deleteItemInInventory(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        await pool.query(sql, [inv_id])
        return true
    } catch (error) {
        console.error("Model error: " + error)
    }
}


module.exports = { 
    getClassifications, 
    getItems, 
    getDetails,
    checkExistingClassification,
    addClassification,
    addItemToInventory,
    updateItemInInventory,
    deleteItemInInventory,
}