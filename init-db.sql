-- Drop tables if they already exist (for development purposes)
-- DROP TABLE IF EXISTS complaints;
-- DROP TABLE IF EXISTS complaint_types;
-- DROP TABLE IF EXISTS areas;
-- DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords
    role VARCHAR(50) CHECK (role IN ('admin', 'employee')) NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Complaint Types Table (Managed by Admin)
CREATE TABLE IF NOT EXISTS complaint_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Areas Table (Managed by Admin)
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    area_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    building VARCHAR(100) CHECK (building IN ('Building A', 'Building B', 'Building C')) NOT NULL,
    floor VARCHAR(50) CHECK (floor IN ('Basement', 'Ground', '1st', '2nd')) NOT NULL,
    area_id INT NOT NULL,
    complaint_type_id INT NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('In-Progress', 'Resolved')) DEFAULT 'In-Progress',
    resolution_date TIMESTAMP NULL,  -- Can only be updated by admin
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE,
    FOREIGN KEY (complaint_type_id) REFERENCES complaint_types(id) ON DELETE CASCADE
);

-- Insert Default Admin User (Change password after first login)
-- INSERT INTO users (name, email, password, role) 
-- VALUES ('Admin User', 'admin@example.com', '$2a$10$ABCDEFGHabcdefgh1234567890ABCDEFGHabcdefgh1234567890', 'admin');

-- Insert Some Default Complaint Types
-- INSERT INTO complaint_types (type_name) VALUES
-- ('Electrical Issue'),
-- ('Plumbing Issue'),
-- ('Internet Issue'),
-- ('Furniture Repair');

-- Insert Some Default Areas
-- INSERT INTO areas (area_name) VALUES
-- ('Library'),
-- ('Cafeteria'),
-- ('Office'),
-- ('Classroom');

