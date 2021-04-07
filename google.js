const puppeteer = require('puppeteer');
const neatCsv = require("neat-csv");
const fs = require("fs");
const csv = fs.readFileSync("domain.csv");
const randomWords = require('random-words');
const mysql_utility = require('./mysql-utility');
var uniqid = require('uniqid');

function generateUsername(firstname, surname) {
    return `${firstname[2]}${surname}2021301`.toLowerCase();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const result = await neatCsv(csv);
    //console.log("result" + JSON.stringify(result));
    //console.log("BEFORE LOOP");
    for(let i=0; i < result.length; i++){
        //console.log("result LOOP" + JSON.stringify(result[i]));

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        //process.exit(0);    

        await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&dsh=S419808731%3A1617613518137801&gmb=exp&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp');
        // Click "Create an account"

        // Wait for page to load
        await sleep(1000);

        // Click "Create a Gmail account instead"

         let firstName = result[i].Firstname;
         let lastName = result[i].Lastname;
         let mobile = result[i].Mobile;
         let username = generateUsername(result[i].Firstname, result[i].Lastname);
         //let password = randomWords(3).join("-");
         let password = firstName+'@54321';

        await page.type('#firstName', firstName);
        await page.type('#lastName', lastName);
        await page.type('#username', username);
        await page.type('input[type="password"][name="Passwd"]', password);
        await page.type('input[type="password"][name="ConfirmPasswd"]', password);
        // Click "Next"
        await page.tap('#accountDetailsNext');
        await page.waitForTimeout(2000);
        await page.type('#phoneNumberId', mobile);
        console.log("create account");  
        await page.evaluate(() => {
            document.querySelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span').click();
        });
        console.log("Enter Otp Code");  
        await page.waitForTimeout(2000);  
        let connection = await mysql_utility.connect_db(); 
        let fullname = firstName+ ' ' +lastName;
        let email = username+"@gmail.com";
        let email_code = uniqid(); 
        data = [email_code, mobile, fullname, email, password, '1'];
        await insertReport(connection, data);
        await browser.close();
        connection.destroy();
 }
})();

var insertReport = async function(connection, data) {
    return new Promise((resolve, reject) => {
        let stmt = `INSERT INTO eauth_gmail_user_cp(email_code, email_mobile, email_name, email, email_password, status) VALUES(?,?,?,?,?,?)`;
        //console.log("\n"+stmt);        
        let insert_sql = connection.query(stmt, data, (err, results) => {
          if (err) {
              reject(err);
              //console.log("ERROR in sending data"+err);
          }
          resolve(results.insertId);
        });
        console.log("info", "INSERT QUERY -> "+insert_sql.sql);
    });
}