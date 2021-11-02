const router = require('express').Router();
// const sequelize = require('sequelize');
const sequelize = require('../../config/connection');
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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
router.post('/', withAuth, (req, res) => {
   let path = process.cwd() + '/public/images/';
   let file = '';

   if (req.files) {
      file = req.files.post_img;
      path += file.name;
   } else {
      path += 'not_available.png';
   }

   Post.create({
      title: req.body.post_title,
      post_url: req.body.post_url,
      user_id: req.session.user_id,
      image_path: path,
   })
      .then((dbPostData) => {
         if (file) {
            // * move file to new directory in server with: mv(path, CB function(err))
            file.mv(path, (err) => {
               if (err) {
                  return res.status(500).json(err);
               }
               return res.send({ status: 'success', path: path });
            });
         }
         // res.render('homepage', { loggedIn: true });
      })
      .catch((err) => {
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
router.put('/upvote', withAuth, (req, res) => {
   // make sure that the session exists first, then if a session does exist, we're using the saved user_id
   // property on the session to insert a new record in the vote table.
   if (req.session) {
      //pass session id along with all destructured properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
         .then(updatedVoteData => res.json(updatedVoteData))
         .catch(err => {
            console.log(err);
            res.status(500).json(err);
         });
   }
});

// PUT /api/posts/1
// data received through req.body and we use req.params.id to ndicate where exactly we want
// the new data to be used.
// IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
router.put('/:id', withAuth, (req, res) => {
   // data received through req.params.id
   Post.update(
      {
         title: req.body.title,
      },
      {
         where: {
            id: req.params.id,
         },
      }
   )
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
router.delete('/:id', withAuth, (req, res) => {
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
