require("dotenv").config();

const { table } = require("console");
const { readFileSync } = require("fs");

const db = require("./connect");

async function setupDatabase() {

    try {
        const tableQuery = readFileSync("./database/tables.sql").toString();
        const result = await db.query(tableQuery);
        db.end();
        console.log("Database setup successful.");
    } catch (err) {
        console.log("Unable to setup database.");
        console.log(err.message);
    }
    
    
}

setupDatabase();