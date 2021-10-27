// This file will contain all of the user-facing routes, such as the homepage and login page

const router = require('express').Router();

// Previously, we used res.send() or res.sendFile() for the response. Because we've hooked up a template
// engine, we can now use res.render() and specify which template we want to use.In this case, we want to
// render the homepage.handlebars template (the.handlebars extension is implied). This template was light
// on content; it only included a single < div >. Handlebars.js will automatically feed that into the
// main.handlebars template, however, and respond with a complete HTML file.
router.get('/', (req, res) => {
   // the second argument object includes all the data we want to pass to our tenmplate (View)
   // Each property on the object (id, post_url, title, etc.) becomes available in the template 'hompage'
   // using the Handlebars.js { { } } syntax.
   res.render('homepage', {
      id: 1,
      post_url: 'http://handlebars.com/guide/',
      created_at: new Date(),
      vote_count: 10,
      comments: [{}, {}],
      user: {
         username: 'test_user',
      },
   });
});

module.exports = router;
