const pool = require("../database/");

async function addMaintenanceRecord(inv_id, maintenance_date, description, cost) {
  try {
    const sql = "INSERT INTO maintenance_records (inv_id, maintenance_date, description, cost) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(sql, [inv_id, maintenance_date, description, cost]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding maintenance record:", error);
    throw error;
  }
}

async function getMaintenanceRecordsByVehicle(inv_id) {
  try {
    const sql = "SELECT * FROM maintenance_records WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    throw error;
  }
}

module.exports = { addMaintenanceRecord, getMaintenanceRecordsByVehicle };