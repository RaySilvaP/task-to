BEGIN TRANSACTION;

CREATE TABLE task_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    kanban_column_id INTEGER NOT NULL,
    due TEXT,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    priority TEXT,

    CONSTRAINT fk_kanban_column FOREIGN KEY (kanban_column_id) REFERENCES kanban_column(id) ON DELETE RESTRICT
);

INSERT INTO task_new (id, name, position, kanban_column_id, due, updated_at, created_at, priority)
SELECT id, name, position, kanban_column_id, due, updated_at, created_at, priority
FROM task;

DROP TABLE tag;
DROP TABLE task;

ALTER TABLE task_new RENAME TO task;

COMMIT;
