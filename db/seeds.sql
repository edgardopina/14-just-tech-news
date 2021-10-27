Insert into user (username, email, password) values
('ep1', 'ep1@mail.com', 'pass1'),
('ep2', 'ep2@mail.com', 'pass2'),
('ep3', 'ep3@mail.com', 'pass3');

Insert into post (title, post_url, user_id) values 
('Post 1', 'http://cnn.com/post1', 1),
('Post 2', 'http://cnn.com/post2', 1),
('Post 3', 'http://cnn.com/post3', 2),
('Post 4', 'http://cnn.com/post4', 2),
('Post 5', 'http://cnn.com/post5', 3),
('Post 6', 'http://cnn.com/post6', 3);

Insert into comment (comment_text, post_id, user_id) values 
('comment 1', 6, 3),
('comment 2', 5, 2),
('comment 3', 4, 1),
('comment 4', 3, 3),
('comment 5', 2, 2),
('comment 6', 1, 1),
('comment 7', 6, 3),
('comment 8', 5, 2),
('comment 9', 4, 1);

Insert into vote (user_id, post_id) values 
(1,3),
(1,6),
(2,1),
(2,2),
(2,3),
(2,4),
(2,5),
(2,6),
(3,1),
(3,3),
(3,5);
