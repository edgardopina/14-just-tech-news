const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// GET /api/users
router.get('/', (req, res) => {
   // access our User model and run .findAll() method from MOdel class in sequelize
   // Model.findAll is equivalent to SELECT * FROM users
   User.findAll({
      attributes: { exclude: ['password'] },
   })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
   // data received through req.params.id
   User.findOne({
      attributes: { exclude: ['password'] },
      include: [
         {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at'],
         },
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
               model: Post,
               attributes: ['title'],
            },
         },
         {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts',
         },
      ],
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/users
router.post('/', withAuth, (req, res) => {
   // expects {username: 'Lernantino', email: 'learnantino@gmail.com', password: 'password1234'}
   // data received through req.body
   User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
   }).then(dbUserData => {
      // give the server easy access to the user's user_id and username, and a boolean describing whether
      // or not the user is logged in.
      // We want to make sure the session is created before we send the response back, so we're wrapping
      // the variables in a callback. The req.session.save() method will initiate the creation of the
      // session and then run the callback function once complete.
      req.session.save(() => {
         req.session.user_id = dbUserData.id;
         req.session.username = dbUserData.username;
         req.session.loggedIn = true;
         // callback
         res.json(dbUserData);
      });
   });
   // .then(dbUserData => res.json(dbUserData))
   // .catch(err => {
   //    console.log(err);
   //    res.status(500).json(err);
   // });
});

// POST /api/users/login
router.post('/login', withAuth, (req, res) => {
   User.findOne({
      where: {
         email: req.body.email,
      },
   }).then(dbUserData => {
      if (!dbUserData) {
         res.status(404).json({ message: 'No user found with that email address!' });
         return;
      }

      //verify user
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
         res.status(400).json({ message: 'Incorrect password!' });
         return;
      }

      // res.json({ user: dbUserData, message: 'You are now logged in!' });
      // added session variables
      req.session.save(() => {
         req.session.user_id = dbUserData.id;
         req.session.username = dbUserData.username;
         req.session.loggedIn = true;
         // callback
         res.json(dbUserData);
      });
   });
});

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
   if (req.session.loggedIn) {
      req.session.destroy(() => {
         res.status(204).end();
      });
   } else {
      res.status(404).end();
   }
});

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
   // expects {username: 'Lernantino', email: 'learnantino@gmail.com', password: 'password1234'}
   // data received through req.body and we use req.params.id to ndicate where exactly we want
   // the new data to be used.
   // IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
   User.update(req.body, {
      individualHooks: true, // paired with hook in User.js
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         // dbUserData[0] is the first element of the response Array, the id
         if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
   User.destroy({
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         // dbUserData[0] is the first element of the response Array, the id
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
