BEGIN TRANSACTION;

CREATE TABLE time_block_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date_time TEXT NOT NULL,
    duration INTEGER NOT NULL,
    task_id INTEGER,
    overlap_order INTEGER NOT NULL,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,

    CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE SET NULL
);

INSERT INTO time_block_new
SELECT *
FROM time_block;

DROP TABLE time_block;

ALTER TABLE time_block_new RENAME TO time_block;

COMMIT;
