const utilities = require("../utilities/")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    errors: null,
    title: "Login",
    nav,
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        errors: null,
        title: "Register",
        nav,
    })
  }


module.exports = {buildLogin, buildRegister}