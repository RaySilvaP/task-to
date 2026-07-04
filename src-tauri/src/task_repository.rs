use std::error::Error;

use rusqlite::{Connection, params};

use crate::models::Task;

pub fn get(conn: &Connection) -> Result<Vec<Task>, Box<dyn Error>> {
    let mut stmt = conn.prepare(
        "
        SELECT id, name, due
        FROM task
        ",
    )?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get("id")?,
                name: row.get("name")?,
                due: row.get("due")?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(tasks)
}

pub fn add(conn: &Connection, task: Task) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "
        INSERT INTO task (name, due)
        VALUES (?, ?)
        ",
        params![task.name, task.due],
    )?;

    Ok(())
}
