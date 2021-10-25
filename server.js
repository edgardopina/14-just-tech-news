const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); //  importing the connection to Sequelize
const path = require('path'); // import path package


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// makes ./public (including stylesheet) to the client
// The express.static() method is a built-in Express.js middleware function that can take all of the
// contents of a folder and serve them as static assets. This is useful for front - end specific 
// files like images, style sheets, and JavaScript files.
/*
! this app.use() MUST be placed before app.use(routes);
*/
app.use(express.static(path.join(__dirname, 'public'))); 

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
/* 
! force: true - it is the equivalent of DROP TABLE IF EXISTS <table-name>
! force: true will recreate tables is there are any association changes
! force: false - this will be the NORMAL state for this property 
! ONCE that we verified that the associations are corectly build, updsate back to false
*/
sequelize.sync({ force: false }).then(() => {
   app.listen(PORT, () => console.log('Now listening on Port:', PORT));
});
