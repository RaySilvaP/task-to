BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS kanban_column_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    context_id INTEGER NOT NULL,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,

    CONSTRAINT fk_context FOREIGN KEY (context_id) REFERENCES context(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    kanban_column_id INTEGER NOT NULL,
    due TEXT,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    priority TEXT,

    CONSTRAINT fk_kanban_column FOREIGN KEY (kanban_column_id) REFERENCES kanban_column(id) ON DELETE CASCADE
);

INSERT INTO kanban_column_new (id, name, position, context_id, updated_at, created_at)
SELECT id, name, position, context_id, updated_at, created_at
FROM kanban_column;

INSERT INTO task_new (id, name, position, kanban_column_id, due, updated_at, created_at, priority)
SELECT id, name, position, kanban_column_id, due, updated_at, created_at, priority
FROM task;

DROP TABLE task;
DROP TABLE kanban_column;

ALTER TABLE task_new RENAME TO task;
ALTER TABLE kanban_column_new RENAME TO kanban_column;

COMMIT;
