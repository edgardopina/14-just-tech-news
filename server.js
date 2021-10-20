const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); //  importing the connection to Sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Since we set up the routes the way we did, we don't have to worry about importing multiple files 
// for different endpoints. The router instance in routes /index.js collected everything for us and
// packaged them up for server.js to use.
app.use(routes); // turn on routes

// turn on connections to databsse and server
// sequelize.sync() method to establish the connection to the database.
// The "sync" part means that this is Sequelize taking the models and connecting them to associated
// database tables. If Sequelize doesn't find a table, it'll create it automatically
// {force: false} in the .sync() method doesn't have to be included, but if it were set to true, it
// would drop and re - create all of the database tables on startup. This is great for when we make
// changes to the Sequelize models, as the database would need a way to understand that something 
// has changed.
sequelize.sync({ force: false })
   .then(() => {
      app.listen(PORT, () => console.log('Now listening'));
   }
);
