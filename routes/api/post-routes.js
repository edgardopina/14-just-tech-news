const router = require('express').Router();
const { User, Post } = require('../../models');

// GET /api/posts - all posts
router.get('/', (req, res) => {
   // access our Post model and run .findAll() method from MOdel class in sequelize
   // Model.findAll is equivalent to SELECT * FROM posts
   Post.findAll({
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order:[['created_at', 'DESC']],
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

// PUT /api/posts/1
router.put('/:id', (req, res) => {
   // data received through req.body and we use req.params.id to ndicate where exactly we want
   // the new data to be used.
   // IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
   Post.update(
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
