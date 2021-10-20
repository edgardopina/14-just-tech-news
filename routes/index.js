const router = require('express').Router();
const apiRoutes = require('./api');

// here we are collecting the packaged group of API endpoints and prefixing them with the path /api.
router.use('/api', apiRoutes);

// this .use() is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating
// we have requested an incorrect resource, another RESTful API practice.
// Now when we import the routes to server.js, they'll already be packaged and ready to go with this one file!
router.use((req, res) => {
   res.status(404), end();
});

module.exports = router;
