const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates the Post model (table)
class Post extends Model {}

// creates fields/columns for Post model (table) - the schema
// this is the equivalent of the sql FOREIGN KEY; however, sequelize need an explicit definition of the relationship
// by using the User.hasMany() method in the index.js file under './models/'
Post.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
      },
      title: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      post_url: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            isUrl: true,
         },
      },
      user_id: {
         type: DataTypes.INTEGER,
         references: {
            model: 'user',
            key: 'id',
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post',
   }
);

module.exports = Post;
