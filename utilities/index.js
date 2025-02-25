const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
//   console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


// Build the vehicleDetail view //

Util.buildVehicleView = async function (vehicleData) {
  let drill;
  if (vehicleData.length > 0) {
    drill = '<div id="vehicle-display">';
    vehicleData.forEach(item => {
      drill += `<div id="item_image">
      <img src="${item.inv_image}" alt="vehicle image"></div>
      <div class="vehicle-details">
      <h2>${item.inv_make} ${item.inv_model} Details</h2>
      <p><strong>Year:</strong> ${item.inv_year}</p>
      <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(item.inv_price)}</p>
      <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(item.inv_miles)} miles</p>
      <p><strong>Color:</strong> ${item.inv_color}</p>
      <p><strong>Description:</strong> ${item.inv_description}</p>
    </div>`;
    });
    drill += "</div>";
  } else {
    drill = '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  console.log(drill);
  return drill;
};


  Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" class="classification-list" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedIn = true; // Set loggedIn to true if JWT is valid
        next();
      }
    );
  } else {
    res.locals.loggedIn = false; // Set loggedIn to false if no JWT is present
    next();
  }
};


/* ****************************************
 * Middleware to check account type
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  if (accountType === 'Employee' || accountType === 'Admin') {
    next();
  } else {
    req.flash('notice', 'You do not have permission to access this page.');
    res.redirect('/account/login');
  }
};

 /* ****************************************
 * Middleware to check login status
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) { // Correct variable name
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util