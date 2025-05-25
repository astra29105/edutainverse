/*
  # Initial Schema Setup for Learning Management System

  1. New Tables
    - users
      - id (uuid, primary key)
      - role (text)
      - name (text)
      - email (text, unique)
      - password_hash (text)
      - profile_pic (text)
      - created_at (timestamptz)
    
    - courses
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - category (text)
      - thumbnail_url (text)
      - created_by (uuid, references users)
      - total_enrollments (int)
      - created_at (timestamptz)
    
    - modules
      - id (uuid, primary key)
      - course_id (uuid, references courses)
      - title (text)
      - description (text)
      - order_number (int)
      - created_at (timestamptz)
    
    - videos
      - id (uuid, primary key)
      - module_id (uuid, references modules)
      - title (text)
      - video_url (text)
      - duration (int)
      - order_number (int)
      - created_at (timestamptz)
    
    - enrollments
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - course_id (uuid, references courses)
      - enrolled_at (timestamptz)
      - last_watched_video (uuid, references videos)
      - progress_percentage (int)
      - created_at (timestamptz)
    
    - completed_modules
      - id (uuid, primary key)
      - enrollment_id (uuid, references enrollments)
      - module_id (uuid, references modules)
      - completed_at (timestamptz)
    
    - wishlists
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - course_id (uuid, references courses)
      - added_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user role
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('student', 'admin')),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  profile_pic text,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Beginner', 'Average', 'Advanced')),
  thumbnail_url text,
  created_by uuid REFERENCES users(id),
  total_enrollments int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  order_number int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text NOT NULL,
  duration int NOT NULL,
  order_number int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  last_watched_video uuid REFERENCES videos(id),
  progress_percentage int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create completed_modules table
CREATE TABLE completed_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id, module_id)
);

-- Create wishlists table
CREATE TABLE wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policies for courses
CREATE POLICY "Anyone can view courses"
  ON courses
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policies for modules
CREATE POLICY "Anyone can view modules"
  ON modules
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can manage modules"
  ON modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policies for videos
CREATE POLICY "Anyone can view videos"
  ON videos
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can manage videos"
  ON videos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policies for enrollments
CREATE POLICY "Students can view their enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can enroll in courses"
  ON enrollments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'student'
    )
  );

-- Create policies for completed_modules
CREATE POLICY "Students can view their completed modules"
  ON completed_modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can mark modules as completed"
  ON completed_modules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Create policies for wishlists
CREATE POLICY "Students can manage their wishlist"
  ON wishlists
  FOR ALL
  USING (auth.uid() = user_id);