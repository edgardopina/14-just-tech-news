const router = require('express').Router();
const { User, Post, Vote } = require('../../models');
const sequelize = require('sequelize');

// GET /api/posts - all posts
router.get('/', (req, res) => {
   // access our Post model and run .findAll() method from MOdel class in sequelize
   // Model.findAll is equivalent to SELECT * FROM posts
   Post.findAll({
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [
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
      attributes: ['id', 'post_url', 'title', 'created_at'],
      include: [
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
   Vote.create({
      user_id: req.body.user_id,
      post_id: req.body.post_id,
   })
      // .then(dbPostData => res.json(dbPostData))
      .then(() => {
         // then find the post we just voted for
         return Post.findOne({
            where: {
               id: req.body.post_id,
            },
            attributes: [
               'id',
               'post_url',
               'title',
               'created_at',
               /*
               ! use raw MySQL aggregate function query to get count of how many votes the post has 
               ! and return it under the name 'vote_count'
               ! NOTE THE ARRAY SYNTAX TO CALL 'sequelize.literal()'
               ! IF we were not counting an associated table but rather the post itself, we could have used 
               ! sequelize.findAndCountAll() method - bummer :(
               */
               [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
            ],
         })
            .then(dbPostData => res.json(dbPostData))
            .catch(err => {
               console.log(err);
               res.status(400).json(err);
            });
      })
      /*
      ! this catch is not shown in the module code, I added it to manage the err exception
      */
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
});

// PUT /api/posts/1
router.put('/:id', (req, res) => {
   // data received through req.body and we use req.params.id to ndicate where exactly we want
   // the new data to be used.
   // IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
   Post.update({
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
