CREATE TABLE IF NOT EXISTS public.job_applications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    salary_range VARCHAR(255),
    date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    screenshot_url TEXT,
    status VARCHAR(50) DEFAULT 'pending'
); 