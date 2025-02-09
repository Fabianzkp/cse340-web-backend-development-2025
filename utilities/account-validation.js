const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/accountModel")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

// valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      throw new Error("Email exists. Please log in or use different email")
    }
  })

/* *******************************
 *  Login Data Validation Rules
 * ******************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address."),
    body("account_password")
      .trim()
      .notEmpty()
      .isLength({ min: 12 })
      .withMessage(
        "Password must be at least 12 characters long and include upper and lowercase letters, a number, and a special character."
      ),
  ]
}

/* ************************************
 * Check data and return errors or proceed to login
 * *********************************** */
validate.checkLoginData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email: req.body.email,
    })
    return
  }
  next()
}

/* *******************************
 *  Update Account Validation Rules
 * ******************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountById(req.body.account_id);
        if (account.account_email !== email) {
          const emailExists = await accountModel.checkExistingEmail(email);
          if (emailExists) {
            throw new Error("Email already in use.");
          }
        }
      }),
  ];
};

/* ************************************
 * Check data and return errors or proceed to update account
 * *********************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/updateAccount", {
      errors,
      title: "Update Account Information",
      nav,
      accountData: req.body,
    });
    return;
  }
  next();
};

/* *******************************
 *  Change Password Validation Rules
 * ******************************* */
validate.changePasswordRules = () => {
  return [
    body("password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ************************************
 * Check data and return errors or proceed to change password
 * *********************************** */
validate.checkChangePasswordData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/updateAccount", {
      errors,
      title: "Update Account Information",
      nav,
      accountData: req.body,
    })
    return
  }
  next()
}

module.exports = validate