CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(50) PRIMARY KEY NOT NULL,
        user_id INT NOT NULL,
        paste_title VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        expiration TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        error_title VARCHAR(255),
        error_content TEXT,
    private BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports
(
    id
    SERIAL
    PRIMARY
    KEY,
    paste_id
    VARCHAR
(
    45
) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    paste_id
) REFERENCES pastes
(
    id
) ON DELETE CASCADE
    );