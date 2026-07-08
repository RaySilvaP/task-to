use crate::{
    database::Database,
    repositories::{
        context::ContextRepository, kanban_column::KanbanColumnRepository, task::TaskRepository,
    },
    services::{context::ContextService, kanban_column::KanbanColumnService, task::TaskService},
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

    pub fn context_service(&self) -> ContextService<'_> {
        ContextService::new(ContextRepository::new(&self.db))
    }
}
