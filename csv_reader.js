const csv = require('csv-parser');
const fs = require('fs');
const randomWords = require('random-words');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const users = [];
function generateUsername(firstname, surname) {
    return `${firstname[0]}-${surname}`.toLowerCase();
}

fs.createReadStream('domain.csv')
  .pipe(csv())
  .on('data', function (row) {
    const username = generateUsername(row.Firstname, row.Lastname);
    const password = randomWords(3).join("-");
    //firstName = row.Firstname;
    const user = {
        username,
        firstname: row.Firstname,
        lastname: row.Lastname,
        mobile: row.Mobile,
        password
    }
    users.push(user)
  })
  .on('end', async function () {
    console.table(users);
    await sleep(1000);
    console.log("INSIDE END");
    });
console.table("OUTER" + users);
console.log("hello word");

/*const neatCsv = require("neat-csv");
const fs = require("fs");
const csv = fs.readFileSync("domain.csv");

(async () => {
const result = await neatCsv(csv);
    console.log("result" + JSON.stringify(result));
   return result;

})();
*/