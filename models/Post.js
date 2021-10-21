const { Model, DataTypes } = require('Sequelize');
const sequelize = require('../config/connection');

// creates the Post model (table)
class Post extends Model {}

// creates fields/columns for Post model (table) - the schema
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
      // this is the equivalent of the sql FOREIGN KEY
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
