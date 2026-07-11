use sea_orm::ActiveValue;

use crate::{
    dto::kanban_column::{KanbanColumnRequest, KanbanColumnResponse}, mappers::{kanban_column, task}, models, repositories::kanban_column::KanbanColumnRepository,
};

pub struct KanbanColumnService<'a> {
    kanban_column_repository: KanbanColumnRepository<'a>,
}

impl<'a> KanbanColumnService<'a> {
    pub fn new(kanban_column_repository: KanbanColumnRepository<'a>) -> Self {
        Self {
            kanban_column_repository,
        }
    }

    pub async fn get(&self, context_id: u32) -> Vec<KanbanColumnResponse> {
        println!("Getting kanban columns for context: {context_id}...");

        let columns = self.kanban_column_repository.get(context_id).await.unwrap();

        println!("Kanban columns retrieved successfully.");

        columns
            .into_iter()
            .map(|(column, tasks)| {
                let tasks = tasks
                    .into_iter()
                    .map(|task| task::model_to_response(task))
                    .collect();
                kanban_column::model_to_response(column, tasks)
            })
            .collect()
    }

    pub async fn add(&self, request: KanbanColumnRequest) {
        println!("Adding new kanban column...");

        let column = self
            .kanban_column_repository
            .add(kanban_column::request_to_active_model(request))
            .await
            .unwrap();

        println!("Kanban Column added successfully: {}.", column.id);
    }

    pub async fn edit(&self, column_id: i32, request: KanbanColumnRequest) {
        println!("Getting kanban column: {column_id}...");

        if let Some(column) = self
            .kanban_column_repository
            .get_by_id(column_id)
            .await
            .unwrap()
        {
            println!("Editing kanban column...");

            let mut active_model: models::kanban_column::ActiveModel = column.into();

            active_model.name = ActiveValue::Set(request.name);
            active_model.position = ActiveValue::Set(request.position);

            self.kanban_column_repository.update(active_model).await.unwrap();

            println!("Kanban column edited successfully.");
        }
        else {
            println!("Kanban column not found.");
        }
    }

    pub async fn delete(&self, column_id: i32) {
        println!("Deleting kanban column: {column_id}...");

        self.kanban_column_repository.delete(column_id).await.unwrap();

        println!("Kanban column deleted successfully.");
    }

}
