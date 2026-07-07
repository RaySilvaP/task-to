use crate::{
    database::Database,
    repositories::{kanban_column::KanbanColumnRepository, task::TaskRepository},
    services::{kanban_column::KanbanColumnService, task::TaskService},
};

pub struct AppState {
    db: Database,
}

impl AppState {
    pub fn new(db: Database) -> Self {
        Self { db }
    }

    pub fn task_service(&self) -> TaskService<'_> {
        TaskService::new(TaskRepository::new(&self.db))
    }

    pub fn kanban_column_service(&self) -> KanbanColumnService<'_> {
        KanbanColumnService::new(KanbanColumnRepository::new(&self.db))
    }
}
