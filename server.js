const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection'); //  importing the connection to Sequelize
const path = require('path'); // import path package
const helpers = require('./utils/helpers'); // import helper functions
const exphbs = require('express-handlebars'); // import express-handlebars
/* 
! Creating session in the back-end */
const session = require('express-session'); // setup express-session
// connect the session to our Sequelize database
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// the session objet
const sess = {
   /*         
   ! this value must be an actual secret and stored in the '.env' file */
   secret: process.env.SECRET,
   // we tell our session to use cookies, If we wanted to set additional options on the
   // cookie, like a maximum age, we would add the options to that object.
   cookie: {},
   resave: false, // use false always
   saveUninitialized: true,
   store: new SequelizeStore({
      db: sequelize,
   }),
};

const hbs = exphbs.create({ helpers }); // instantiate express-handlebars object
app.engine('handlebars', hbs.engine); // sets express engine 'handlebars' from handlebars' engine
app.set('view engine', 'handlebars'); // sets 'view engine' from app.engine


/* 
! middleware to create session in the back-end */
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// makes ./public (including stylesheet) to the client
// The express.static() method is a built-in Express.js middleware function that can take all of the
// contents of a folder and serve them as static assets. This is useful for front - end specific
// files like images, style sheets, and JavaScript files.
/* 
! this app.use(express.static.....) MUST be placed before app.use(routes); */
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
! ONCE that we verified that the associations are corectly built, update back to false */
sequelize.sync({ force: false }).then(() => {
   app.listen(PORT, () => console.log('Now listening on Port:', PORT));
});
