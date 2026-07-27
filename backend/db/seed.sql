-- Sample data so /courses and the UI have something to show

INSERT INTO organization (name, location) VALUES
  ('Nova Academy', 'Bengaluru, India'),
  ('Brightpath Institute', 'Remote')
ON CONFLICT DO NOTHING;

INSERT INTO instructor (name, bio, org_id) VALUES
  ('Ananya Rao', 'Full-stack engineer and educator with 8 years of industry experience.', 1),
  ('Marcus Lee', 'Data scientist focused on applied machine learning.', 1),
  ('Priya Nair', 'UX designer and instructor specializing in product design.', 2)
ON CONFLICT DO NOTHING;

INSERT INTO course (title, description, duration_weeks, instructor_id, category) VALUES
  ('Full-Stack Web Development', 'Build and deploy full-stack apps with React, Node.js, and PostgreSQL.', 10, 1, 'Development'),
  ('Introduction to Machine Learning', 'Core ML concepts, from linear regression to neural networks.', 8, 2, 'Data'),
  ('UI/UX Design Fundamentals', 'Learn user-centered design, wireframing, and prototyping.', 6, 3, 'Design'),
  ('Advanced JavaScript', 'Deep dive into closures, async patterns, and the JS event loop.', 5, 1, 'Development'),
  ('Data Analysis with Python', 'Pandas, NumPy, and data visualization for real-world datasets.', 7, 2, 'Data')
ON CONFLICT DO NOTHING;

INSERT INTO module (course_id, title, duration_minutes) VALUES
  (1, 'HTML, CSS & the DOM', 90),
  (1, 'React Fundamentals', 120),
  (1, 'Building a REST API with Express', 150),
  (1, 'PostgreSQL & Data Modeling', 100),
  (2, 'Linear & Logistic Regression', 100),
  (2, 'Decision Trees & Random Forests', 110),
  (2, 'Neural Network Basics', 130),
  (3, 'Design Thinking Basics', 80),
  (3, 'Wireframing & Prototyping', 100),
  (4, 'Closures & Scope', 60),
  (4, 'Promises & Async/Await', 70),
  (5, 'Pandas Essentials', 90),
  (5, 'Data Visualization with Matplotlib', 90)
ON CONFLICT DO NOTHING;
