BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL
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
    tag_id INTEGER NULL,

    CONSTRAINT fk_kanban_column FOREIGN KEY (kanban_column_id) REFERENCES kanban_column(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE SET NULL
);

INSERT INTO task_new (id, name, position, kanban_column_id, due, updated_at, created_at, priority, tag_id)
SELECT id, name, position, kanban_column_id, due, updated_at, created_at, priority, null 
FROM task;

DROP TABLE task;

ALTER TABLE task_new RENAME TO task;

COMMIT;
