use crate::{
    database::Database,
    repositories::{
        context::ContextRepository, kanban_column::KanbanColumnRepository, tag::TagRepository,
        task::TaskRepository, time_block::TimeBlockRepository,
    },
    services::{
        context::ContextService, kanban_column::KanbanColumnService, tag::TagService,
        task::TaskService, time_block::TimeBlockService,
    },
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

    pub fn time_block_service(&self) -> TimeBlockService<'_> {
        TimeBlockService::new(TimeBlockRepository::new(&self.db))
    }

    pub fn tag_service(&self) -> TagService<'_> {
        TagService::new(TagRepository::new(&self.db))
    }
}
