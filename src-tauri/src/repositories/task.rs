use std::error::Error;

use crate::{database::Database, dto::Task};

pub struct TaskRepository<'a> {
    db: &'a Database,
}

impl<'a> TaskRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        TaskRepository { db }
    }

    pub fn get(&self) -> Result<Vec<Task>, Box<dyn Error>> {
        Ok(vec![])
    }
}
