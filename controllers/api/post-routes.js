const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const sequelize = require('sequelize');

// GET /api/posts - all posts
router.get('/', (req, res) => {
   // access our Post model and run .findAll() method from MOdel class in sequelize
   // Model.findAll is equivalent to SELECT * FROM posts
   Post.findAll({
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         /*
         ! add count of votes per post         
         */
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      order: [['created_at', 'DESC']],
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
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET /api/posts/1
router.get('/:id', (req, res) => {
   // data received through req.params.id
   Post.findOne({
      where: {
         id: req.params.id,
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         /*
         ! add count of votes per post         
         */
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
         if (!dbPostData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/posts
router.post('/', (req, res) => {
   // data received through req.body
   Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id,
   })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// PUT /api/posts/upvote
/*
! when we vote on a post, we are technically uopdating the post's data 
! THIS ROUTE MUST BE PLACED BEFORE THE '/:id' ROUTE BELOW, OTHERWISE, EXPRESS.JS WILL THINK THAT THE
! WORD 'upvote' IS A VALID PARAMETER FOR '/:id' 
*/
router.put('/upvote', (req, res) => {
   // custom static method created in models/Post.js
   Post.upvote(req.body, { Vote })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
});

// PUT /api/posts/1
// data received through req.body and we use req.params.id to ndicate where exactly we want
// the new data to be used.
// IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
router.put('/:id', (req, res) => {
   // data received through req.params.id
   Post.update(req.body, {
      where: {
         id: req.params.id,
      },
   })
      .then(dbPostData => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// DELETE /api/posts/1
router.delete('/:id', (req, res) => {
   Post.destroy({
      where: {
         id: req.params.id,
      },
   })
      .then(dbPostData => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
