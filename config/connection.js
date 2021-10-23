// import the Sequalize ctor from the library
const Sequelize = require('sequelize'); // import the Sequelize constructor from the library
require('dotenv').config();


// Create connection to our database, passing MySQL info for username and password as dotenv variables!
let sequelize;
// When the app is deployed to heroku, it will have access to Heroku's process.env.JAWSDB_URL variable and use that 
// value to connect.Otherwise, it will continue using the localhost configuration.
if (process.env.JAWSDB_URL) {
   sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
   sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
   });
}

module.exports = sequelize;
