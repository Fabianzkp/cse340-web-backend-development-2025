const utilities = require("../utilities/");
const accountModel = require("../models/accountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    errors: null,
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    errors: null,
    title: "Register",
    nav,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.status(201).redirect("/account/login"); // Redirect to login page after successful registration
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      errors: null,
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process Login  
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Fetch user by email
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email,  // Pass the entered email back
    });
  }

  // Compare hashed password
  try {
    const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
    if (isPasswordValid) {
      delete accountData.account_password;

      // Create JWT token
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }

      return res.redirect("/account"); // Redirect to account management view after successful login
    } else {
      req.flash("notice", "Incorrect email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: account_email,  // Pass the entered email back
      });
    }
  } catch (error) {
    console.log('Error during login:', error);
    req.flash("notice", "An error occurred. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email,  // Pass the entered email back
    });
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", {
    errors: null,
    title: "Account Management",
    nav,
  });
}

/* ****************************************
 *  Handle logout
 * *************************************** */
function logout(req, res) {
  res.clearCookie('jwt');
  req.flash('notice', 'You have successfully logged out.');
  res.redirect('/');
}


/* ****************************************
 *  Deliver update account view
 * *************************************** */
async function buildUpdateAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const accountId = req.params.accountId;
  const accountData = await accountModel.getAccountById(accountId);
  res.render("account/updateAccount", {
    errors: null,
    title: "Update Account Information",
    nav,
    accountData,
  });
}


/* ****************************************
 *  Handle account update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  console.log("Updating account with data:", req.body);

  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

    if (updateResult) {
      req.flash("notice", "Account updated successfully.");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Sorry, the account update failed.");
      return res.status(500).render("account/updateAccount", {
        title: "Update Account Information",
        nav,
        errors: null,
        accountData: req.body,
        locals: {
          account_firstname: req.body.account_firstname,
          account_lastname: req.body.account_lastname,
          account_email: req.body.account_email
        }
      });
    }
  } catch (error) {
    console.error("Error during account update:", error);
    req.flash("notice", "An error occurred during the account update.");
    return res.status(500).render("account/updateAccount", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: req.body,
      locals: {
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email
      }
    });
  }
}
/* ****************************************
 *  Handle password change
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, password, account_firstname, account_lastname, account_email } = req.body;

  console.log("Changing password with data:", req.body);

  // Hash the new password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.');
    return res.status(500).render("account/updateAccount", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: req.body,
      locals: {
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email
      }
    });
  }

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    return res.status(500).render("account/updateAccount", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: req.body,
      locals: {
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email
      }
    });
  }
}




module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  logout, buildUpdateAccountView,
  updateAccount,
  changePassword
};