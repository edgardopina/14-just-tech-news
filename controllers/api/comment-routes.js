const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// GET /api/comments
router.get('/', (req, res) => {
   Comment.findAll()
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/comments - create a comment
router.post('/', withAuth, (req, res) => {
   // check for an active session to ensure that only logged users can interact with the database
   if (req.session) {
      Comment.create({
         comment_text: req.body.comment_text,
         // user_id: req.body.user_id,
         user_id: req.session.user_id,
         post_id: req.body.post_id,
      })
         .then(dbCommentData => res.json(dbCommentData))
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   }
});

// DELETE /api/comments/1
router.delete('/:id', withAuth, (req, res) => {
   Comment.destroy({
      where: {
         id: req.params.id,
      },
   })
      .then(dbCommentData => {
         if (!dbCommentData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbCommentData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
