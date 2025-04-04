
-- Insert a new location
INSERT INTO activity_locations (id, name, address, latitude, longitude)
VALUES 
  ('85d92f42-8f8c-4b2c-9c7f-690d5a4c4569', 'Central Park Adventure Center', '59 Central Park West, New York, NY 10023', 40.7767, -73.9761);

-- Insert a second location for one of the variants
INSERT INTO activity_locations (id, name, address, latitude, longitude)
VALUES 
  ('a380c8e4-7b21-4f6c-9c6d-5d6e7f8a9b0c', 'Brooklyn Adventure Outpost', '127 Atlantic Ave, Brooklyn, NY 11201', 40.6901, -73.9969);

-- Insert a new organizer
INSERT INTO activity_organizers (id, name, description)
VALUES 
  ('c67d9e5b-4a89-4a6f-9c1d-2e3f4a5b6c7d', 'Explorer Kids Co.', 'Delivering premium outdoor adventures for kids of all ages since 2015');

-- Insert the main activity
INSERT INTO activities (
  id, 
  title, 
  description, 
  category, 
  image, 
  featured, 
  min_age, 
  max_age, 
  duration, 
  group_size, 
  schedule, 
  price, 
  location_id,
  organizer_id
)
VALUES (
  '94f85d23-17e2-4b9c-a642-d386c9561a2f',
  'Ultimate Adventure Camp',
  'Join us for the ultimate outdoor adventure camp where kids will learn survival skills, team building, and enjoy exciting activities like rock climbing, zip-lining, and nature exploration. Each day brings new challenges and adventures in a safe, supervised environment. All equipment is provided, just bring comfortable clothes, sunscreen, and a spirit of adventure!',
  'Outdoor Adventures',
  'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?q=80&w=1470&auto=format&fit=crop',
  true,
  8,
  14,
  '5 days',
  'Up to 12 kids per group',
  'Monday to Friday, 9:00 AM - 3:00 PM',
  299.99,
  '85d92f42-8f8c-4b2c-9c7f-690d5a4c4569',
  'c67d9e5b-4a89-4a6f-9c1d-2e3f4a5b6c7d'
);

-- Insert variants for the activity
INSERT INTO activity_variants (
  id,
  activity_id,
  name,
  description,
  price_adjustment,
  location_id
)
VALUES
  (
    'df5a9e8c-7b6d-4c2f-a1e3-b4d5c6e7f8a9',
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Junior Explorers',
    'Modified activities for younger participants (ages 8-10) with extra supervision',
    -50.00,
    '85d92f42-8f8c-4b2c-9c7f-690d5a4c4569'
  ),
  (
    'e2d1c0b9-a8f7-4e6d-5c4b-3a2d1e0f9b8c',
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Advanced Explorers',
    'More challenging activities for experienced kids (ages 11-14) with advanced skills training',
    50.00,
    '85d92f42-8f8c-4b2c-9c7f-690d5a4c4569'
  ),
  (
    'b7c6d5e4-f3a2-1b0c-9d8e-7f6g5h4j3k2l',
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Brooklyn Adventure',
    'Same great program but located at our Brooklyn facility with urban adventure elements',
    75.00,
    'a380c8e4-7b21-4f6c-9c6d-5d6e7f8a9b0c'
  );

-- Insert packages for the activity
INSERT INTO activity_packages (
  id,
  activity_id,
  name,
  description,
  price,
  max_participants
)
VALUES
  (
    'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Family Pack',
    'Special rate for 3 or more siblings attending together',
    799.99,
    5
  ),
  (
    'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Private Group',
    'Book the entire experience exclusively for your group',
    2999.99,
    12
  );

-- Insert requirements for the activity
INSERT INTO activity_requirements (
  activity_id,
  description
)
VALUES
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Participants must be between 8-14 years old'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Health form and parental consent required'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Comfortable outdoor clothing and closed-toe shoes'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Water bottle and sunscreen'
  );

-- Insert expectations for the activity
INSERT INTO activity_expectations (
  activity_id,
  description
)
VALUES
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Daily hands-on outdoor activities and adventures'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Professional instructors with outdoor education certification'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'All necessary equipment and safety gear provided'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Daily healthy lunch and snacks included'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Small group sizes (max 12 kids per instructor)'
  );

-- Insert some reviews
INSERT INTO activity_reviews (
  activity_id,
  reviewer_name,
  rating,
  comment,
  review_date
)
VALUES
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Sarah Johnson',
    5,
    'My son had the absolute best time at this camp! The instructors were knowledgeable and caring, and he came home each day full of exciting stories. Highly recommended!',
    CURRENT_DATE - INTERVAL '5 days'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Michael Rodriguez',
    4,
    'Great program overall. My daughter loved the climbing activities and made new friends. Only suggestion would be more water breaks during hot days.',
    CURRENT_DATE - INTERVAL '12 days'
  ),
  (
    '94f85d23-17e2-4b9c-a642-d386c9561a2f',
    'Emily Chen',
    5,
    'This was our third year sending our kids to this camp and it keeps getting better! The new zip-line activity was a huge hit with my twins.',
    CURRENT_DATE - INTERVAL '3 days'
  );
