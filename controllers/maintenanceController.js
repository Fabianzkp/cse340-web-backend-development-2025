const maintenanceModel = require("../models/maintenanceModel");
const utilities = require("../utilities/");

async function addMaintenanceRecord(req, res, next) {
  const { inv_id, maintenance_date, description, cost } = req.body;
  try {
    const record = await maintenanceModel.addMaintenanceRecord(inv_id, maintenance_date, description, cost);
    req.flash("notice", "Maintenance record added successfully.");
    res.redirect(`/inv/maintenance/${inv_id}`);
  } catch (error) {
    req.flash("error", "Failed to add maintenance record.");
    res.redirect(`/inv/maintenance/${inv_id}`);
  }
}

async function viewMaintenanceRecords(req, res, next) {
  const { inv_id } = req.params;
  try {
    const records = await maintenanceModel.getMaintenanceRecordsByVehicle(inv_id);
    const nav = await utilities.getNav();
    res.render("inventory/maintenanceRecords", {
      title: "Maintenance Records",
      nav,
      records,
      inv_id,
      errors: null,
    });
  } catch (error) {
    req.flash("error", "Failed to fetch maintenance records.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = { addMaintenanceRecord, viewMaintenanceRecords };