CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL
);

-- Insert some sample universities
INSERT INTO universities (name, url) VALUES
('Dhaka University', 'https://www.du.ac.bd'),
('BUET', 'https://www.buet.ac.bd'),
('Rajshahi University', 'https://www.ru.ac.bd'),
('Chittagong University', 'https://cu.ac.bd'),
('Jahangirnagar University', 'https://www.jnu.ac.bd'); 