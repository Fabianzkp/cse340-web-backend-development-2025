const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get all inventory items for the inventory view page
 * ************************** */
  async function getVehicleByInvId(inv_id) {
    try {
      const sql = await pool.query('SELECT * FROM public.inventory WHERE inv_id = $1',
      [inv_id]
      )
      return sql.rows[0]
     } catch (error) {
      console.error("getVehicleDetailById error " + error)
    }
  }
  

// Check for existing classification

async function checkExistingClassification(classification_name) {
  try {
      const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
      const result = await pool.query(sql, [classification_name]);
      return result.rowCount > 0; // Returns true if at least one row exists, false otherwise
  } catch (error) {
      console.error("Database Error:", error.message);
      return false; // In case of an error, return false so it doesn't break validation
  }
}

/* ***************************
 *  Add classification name to classification table
 * ************************** */

async function addClassificationName (classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING*"
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}


/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_price,
  inv_image,
  inv_thumbnail,
  inv_miles,
  inv_color
  
) {
  try {
    const sql = `
      INSERT INTO inventory (classification_id,
        inv_make, inv_model, inv_year, inv_description,
        inv_price, inv_image, inv_thumbnail, inv_miles, inv_color 
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_color
      
    ];

    console.log("SQL Query: ", sql, "Values: ", values); 

    const result = await pool.query(sql, values);
    return result.rows[0]; // Return the inserted inventory item
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteVehicleByInvId(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1 RETURNING *';
    const data = await pool.query(sql, [inv_id]);

    return data.rowCount > 0; // Returns true if an item was deleted, false otherwise
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    return false; // Return false if an error occurs
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInvId,
  checkExistingClassification, addClassificationName, addInventory, updateInventory,
  deleteVehicleByInvId
}