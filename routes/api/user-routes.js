const router = require('express').Router();
const { User } = require('../../models');

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
router.post('/', (req, res) => {
   // expects {username: 'Lernantino', email: 'learnantino@gmail.com', password: 'password1234'}
   // data received through req.body
   User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
   })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/users/login
router.post('/login', (req, res) => {
   User.findOne({
      where: {
         email: req.body.email,
      },
   }).then(dbUserData => {
      if (!dbUserData) {
         res.status(404).json({ message: 'No user found with that email address!' });
         return;
      }
      // res.json({ user: dbUserData });
      //verify user
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
         res.status(400).json({ message: 'Incorrect password!' });
         return;
      }
      res.json({ user: dbUserData, message: 'You are now logged in!' });
   });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
