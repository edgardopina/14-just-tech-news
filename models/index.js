const User = require('./User');
const Post = require('./Post');

// create associations
// one user can have many posts defined through the foreign key in the Post model
User.hasMany(Post, {
   foreignKey: 'user_id',
});

// AND WE ALSO NEED TO MAKE THE REVERSE ASSOCIATION: a post can belong to one user but not many iusers
Post.belongsTo(User, {
   foreignKey: 'user_id',
});


// All this file is responsible for right now is importing the User model and exporting an object
// with it as a property.It seems unnecessary at the moment, but doing this now will set us up for
// future growth of the application.
module.exports = { User, Post };
