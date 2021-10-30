// import the Sequalize ctor from the library
const Sequelize = require('sequelize'); // import the Sequelize constructor from the library
require('dotenv').config();


// Create connection to our database, passing MySQL info for username and password as dotenv variables!
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
   host: 'localhost',
   dialect: 'mysql',
   port: 3306,
   //logging: false, //false - preventose verbose of SQL commands to the console
});

module.exports = sequelize;
