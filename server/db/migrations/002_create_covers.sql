CREATE TABLE IF NOT EXISTS covers (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    job_title VARCHAR(255),
    company VARCHAR(255),
    cover_letter_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 