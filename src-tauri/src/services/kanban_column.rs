use crate::{dto::KanbanColumn, mappers::{kanban_column, task}, repositories::kanban_column::KanbanColumnRepository};

pub struct KanbanColumnService<'a> {
    kanban_column_repository: KanbanColumnRepository<'a>,
}

impl<'a> KanbanColumnService<'a> {
    pub fn new(kanban_column_repository: KanbanColumnRepository<'a>) -> Self {
        Self {
            kanban_column_repository,
        }
    }

    pub async fn get_columns(&self, context_id: u32) -> Vec<KanbanColumn> {
        let columns = self
            .kanban_column_repository
            .get_columns(context_id)
            .await
            .unwrap();

        columns
            .into_iter()
            .map(|(column, tasks)| {
                let tasks = tasks.into_iter().map(|task| task::model_to_dto(task)).collect();
                kanban_column::model_to_dto(column, tasks)
            })
            .collect()
    }
}
