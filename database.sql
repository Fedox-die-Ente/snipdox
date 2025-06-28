CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    image TEXT,
    admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(50) PRIMARY KEY NOT NULL,
        user_id INT NOT NULL,
        paste_title VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        expiration TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        error_title VARCHAR(255),
        error_content TEXT,
        private BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    paste_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE IF NOT EXISTS allowed_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
)
