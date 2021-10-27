// This file will contain all of the user-facing routes, such as the homepage and login page
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Previously, we used res.send() or res.sendFile() for the response. Because we've hooked up a template
// engine, we can now use res.render() and specify which template we want to use.In this case, we want to
// render the homepage.handlebars template (the.handlebars extension is implied). This template was light
// on content; it only included a single < div >. Handlebars.js will automatically feed that into the
// main.handlebars template, however, and respond with a complete HTML file.
router.get('/', (req, res) => {
   Post.findAll({
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      include: [
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
               model: User,
               attributes: ['username'],
            },
         },
         {
            model: User,
            attributes: ['username'],
         },
      ],
   })
      .then(dbPostData => {
         // posts - full array of posts data only
         const posts = dbPostData.map(post => post.get({ plain: true }));
         // we wrap the array posts and pass it as an objectto be able to add more properties to the template later
         res.render('homepage', { posts });
      })
      .catch(err => {
         console.error(err);
         res.status(500).json(err);
      });
});


// renders login page
router.get('/login', (req, res) => {
   res.render('login');
});

module.exports = router;
