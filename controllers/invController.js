const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory by detail view
 * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getVehicleByInvId(inv_id)
  // To ensure vehicleData is not empty
  if (!vehicleData || vehicleData.length === 0) {
    throw new Error("Vehicle not found.")
  }
  const drill = await utilities.buildVehicleView(vehicleData)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/vehicle", {
    title: vehicleName + " vehicles",
    nav,
    drill,
    errors: null,
  })
}

/* ***************************
 *  intentionally cause an error
 * ************************** */

invCont.causeError = async function (req, res, next) {
  console.log("Causing an error...");
  try {
      let aNumber = 1 / 0; // Simulated error
      throw new Error("This is an intentional error.");
  } catch (error) {
      next(error); // Pass the error to the next middleware
  }
};

/* ***************************
 *  build vehicle management view
 * ************************** */

invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/vehicleManagement", {
    title: "Vehicles Management",
    nav,
    errors: null,
    classificationSelect,
  })
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  build add classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
    
  })
}

/* ***************************
 *  Process add classification form data
 * ************************** */

invCont.buildAddClassificationName = async function (req, res, next) {
  const {classification_name} = req.body
  const addclass = await invModel.addClassificationName(classification_name)
  const classificationSelect = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  if (addclass){ 
  req.flash ("notice", `Classification ${classification_name} was successfuly added.`)
  res.render("inventory/vehicleManagement", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classification_name,
    classificationSelect,
  }) 
} else {
  req.flash ("notice", "Sorry new classification could not be added.")
  res.status(501).render("inventory/addClassification", {
  title: "Add Classification",
  nav,
  errors: null,
  classification_name,
  })
}
} 


/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/addInventory", {
    title: "Add Inventory",
    nav,
    classifications: classifications.rows,  
    classificationList,
    errors: null,
  });
};


/* ***************************
 *  Add inventory to database
 * ************************** */
invCont.buildAddInventoryItem = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, 
          inv_image, inv_thumbnail, inv_miles, inv_color,} = req.body;

  try {
    const addInventory = await invModel.addInventory(classification_id, inv_make, inv_model,
      inv_year, inv_description, inv_price,
      inv_image, inv_thumbnail, inv_miles, inv_color);

    const classifications = await invModel.getClassifications();
    const classificationSelect = await utilities.buildClassificationList()
    const classificationList = await utilities.buildClassificationList(classifications);
    let nav = await utilities.getNav();

    req.flash("notice", "Inventory was successfully added.");
    res.render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classification_id, inv_make, inv_model, inv_year, inv_description, inv_price,
      inv_image, inv_thumbnail, inv_miles, inv_color,
      classificationList,
      classificationSelect,
    });

  } catch (error) { 
    console.error("Error adding inventory:", error); 
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    const classificationList = await utilities.buildClassificationList();

    req.flash("notice", "Sorry, inventory could not be added. " + error.message); // Display error message
    res.status(501).render("inventory/addInventory", {
      title: "Add Inventory",
      nav, 
      classifications,
      classificationList,
      errors: null, 
      classification_id, inv_make, inv_model, inv_year, inv_description, inv_price,
      inv_image, inv_thumbnail, inv_miles, inv_color,
    });
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Edit/Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont