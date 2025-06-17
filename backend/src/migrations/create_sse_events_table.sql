-- Create SSE Events table for storing real-time event history
CREATE TABLE IF NOT EXISTS sse_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some sample data for testing (optional)
-- INSERT INTO sse_events (event_type, event_data) VALUES 
-- ('test', '{"type": "test", "message": "System initialized", "timestamp": "2024-01-01T00:00:00.000Z"}');
