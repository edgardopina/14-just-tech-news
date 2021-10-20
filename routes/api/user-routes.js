const router = require('express').Router();
const { json } = require('express/lib/response');
// const { User } = require('../../models/User');
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
   // access our User model and run .findAll() method from MOdel class in sequelize
   // Model.findAll is equivalent to SELECT * FROM users
   User.findAll()
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
         console.log(err);
         res.sttatus(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
   // data received through req.params.id
   User.findOne({
      where: {
         id: req.params.id,
      },
   })
      .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
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

// PUT /api/isers/1
router.put('/:id', (req, res) => {
   // expects {username: 'Lernantino', email: 'learnantino@gmail.com', password: 'password1234'}
   // data received through req.body and we use req.params.id to ndicate where exactly we want
   // the new data to be used.
   // IF req.body has exact key/value pairs to match the model, you can just use `req.body` instead
   User.update(req.body, {
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
         res.jason(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// DELETE /api/isers/1
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
         res.jason(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
