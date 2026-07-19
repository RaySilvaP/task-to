ALTER TABLE context DROP COLUMN updated_at;
ALTER TABLE context DROP COLUMN created_at;

ALTER TABLE task DROP COLUMN updated_at;
ALTER TABLE task DROP COLUMN created_at;

ALTER TABLE kanban_column DROP COLUMN updated_at;
ALTER TABLE kanban_column DROP COLUMN created_at;

DROP TABLE IF EXISTS time_block;
