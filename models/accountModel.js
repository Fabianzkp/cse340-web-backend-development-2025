const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM public.account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount > 0
    } catch (error) {
        console.error("Database Error:", error.message);
      return false;
    }
  }



/* *******************************
 *   Fetch User by Email
 * ******************************* */
async function getUserByEmail(account_email) {
    try {
        const sql = "SELECT * FROM public.account WHERE account_email = $1";
        const user = await pool.query(sql, [account_email]);
        return user.rows[0]; // Return the user record
    } catch (error) {
        return error.message;
    }
  }
  
  /* *****************************
  * Return account data using email address
  * ***************************** */
  async function getAccountByEmail (account_email) {
    try {
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
      return result.rows[0]
    } catch (error) {
      return new Error("No matching email found")
    }
  }
  
  /* *******************************  
  * Return account data using account_id  
  * ******************************* */
  async function getAccountById(accountId) {
    try {
      const result = await pool.query(
        "SELECT * FROM public.account WHERE account_id = $1",
        [accountId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching account data:", error);
      throw error;
    }
  }
  

// Update account
  async function updateAccount(accountId, firstname, lastname, email) {
    try {
      const result = await pool.query(
        "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
        [firstname, lastname, email, accountId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  }

  // Update password
  async function updatePassword(accountId, hashedPassword) {
    try {
      const result = await pool.query(
        "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *",
        [hashedPassword, accountId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
  


module.exports = { registerAccount, checkExistingEmail, 
  getUserByEmail, getAccountByEmail, getAccountById,
  updateAccount,
  updatePassword};

