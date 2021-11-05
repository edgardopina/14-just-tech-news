const url = 'https://api.cloudinary.com/v1_1/diqgo2b5e/image/upload';
const form = document.querySelector('.new-post-form');
const NO_URL = 'https://res.cloudinary.com/diqgo2b5e/image/upload/v1636068149/tech-news/oo3qhjhz534qsyq0mgrq.jpg';

form.addEventListener('submit', event => {
   event.preventDefault();
   const formData = new FormData(form);
   const file = document.querySelector('#post_img').files[0];
   if (file) {
      const formFileData = new FormData();
      formFileData.append('file', file);
      formFileData.append('upload_preset', 't1ipqlym');
      fetch(url, {
         method: 'POST',
         body: formFileData,
      })
         .then(response => {
            return response.json();
         })
         .then(data => {
            formData.append('secure_url', data.secure_url);
            fetch(`/api/posts`, {
               method: 'POST',
               body: formData,
            }).then(response => {
               if (response.ok) {
                  document.location.replace('/dashboard');
               } else {
                  alert("Couldn't create new post.", response.statusText);
               }
            });
         });
   } else {
      formData.append('secure_url', NO_URL);
      fetch(`/api/posts`, {
         method: 'POST',
         body: formData,
      }).then(response => {
         if (response.ok) {
            document.location.replace('/dashboard');
         } else {
            alert("Couldn't create new post.", response.statusText);
         }
      });
   }
});
