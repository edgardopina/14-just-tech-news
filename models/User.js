// import Model class and DataTypes object
// This Model class is what we create our own models from using the extends keyword so
// User inherits all of the functionality that the Model class has.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create User model
class User extends Model {}

// define table columns and configuration
// .init() method to initialize the model's data and configuration, passing in two objects
// as arguments: The first object will define the columns and data types for those columns.
// The second object it accepts configures certain options for the table.
User.init(
   // TODO - table configuration options go here  (https://sequelize.org/v5/manual/models-definition.html#configuration)
   {
      // id column
      id: {
         type: DataTypes.INTEGER, // use the special Sequelize DataTypes object provide what type of data it is
         allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
         primaryKey: true, // instruct that this is the Primary Key
         autoIncrement: true, // turn on auto increment
      },
      // username column
      username: {
         type: DataTypes.STRING, // use the special Sequelize DataTypes object provide what type of data it is
         allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
      },
      // email column
      email: {
         type: DataTypes.STRING, // use the special Sequelize DataTypes object provide what type of data it is
         allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
         unique: true, // there cannot be any duplicate email values in this table
         // IF allowNull IS SET TO false, we can run our data through validators before creating the table data
         validate: {
            isEmail: true,
         },
      },
      // password column
      password: {
         type: DataTypes.STRING, // use the special Sequelize DataTypes object provide what type of data it is
         allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
         // IF allowNull IS SET TO false, we can run our data through validators before creating the table data
         validate: {
            len: [4], // password must be at least four characters long
         },
      },
   },
   {
      sequelize, // pass in our imported sequelize connection (the direct connection to our database)
      timestamps: false, // don't automatically create createdAt/updatedAt timestamp fields
      freezeTableName: true, // do NOT PLURALIZE name of database table
      underscored: true, // USE UNDERSCORES INSTEAD OF CAMEL-CASING (i.e. `comment_text` and not `commentText`)
      modelName: 'user', // make it so our model name stays lowercase in the database
   }
);

module.exports = User;
