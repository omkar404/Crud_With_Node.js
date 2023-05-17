const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ProductCrud",
    multipleStatements: true,
}); 

connection.connect((err) => {
    if (err) {
        console.log("Error in Database connection" + JSON.stringify(err, undefined, 2));
    }
    else {
        console.log("Connection Successfully");
    }
});

module.exports=connection;