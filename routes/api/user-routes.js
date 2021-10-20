const router = require('expres').Router();
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

// GET /api/isers/1
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {});

// PUT /api/isers/1
router.put('/:id', (req, res) => {});

// DELETE /api/isers/1
router.delete('/:id', (req, res) => {});

module.exports = router;
