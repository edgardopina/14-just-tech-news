async function newFormHandler(event){
   event.preventDefault();

   const title = document.querySelector('input[name="post-title"]').value;
   const post_url = document.querySelector('input[name="post-url"]').value;
   const imgPath = document.querySelector('input[name="post-img"]').value;
   const files = document.querySelector('#post-img').value;

   const image_path = `/public/images/${
      imgPath ? imgPath.toString().split('\\')[imgPath.toString().split('\\').length - 1] : 'not_available.png'
   }`;

   /********************   
   const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
         title,
         post_url,
         image_path,
      }),
      headers: {
         'Content-Type': 'application/json',
      },
   });
 ********************/
   
   const formData = new FormData();
   formData.append('title', title);
   formData.append('post_url', post_url);
   formData.append('image_path', image_path);
   // formData.append('image-file', files);
   
   const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: formData,
   });

   if (response.ok) {
      document.location.replace('/dashboard');
   } else {
      console.log('IT DID NOT WORK');
      alert(response.statusText);
   }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

