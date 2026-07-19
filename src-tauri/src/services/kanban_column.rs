use std::collections::HashMap;

use sea_orm::ActiveValue;

use crate::{
    dto::kanban_column::{KanbanColumnRequest, KanbanColumnResponse},
    mappers::{kanban_column, task},
    models::{self, OrderRequest},
    repositories::kanban_column::KanbanColumnRepository,
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

        let now = chrono::Utc::now().to_rfc3339();
        let mut active_model = kanban_column::request_to_active_model(request);
        active_model.created_at = ActiveValue::Set(now.clone());
        active_model.updated_at = ActiveValue::Set(now);

        let column = self
            .kanban_column_repository
            .add(active_model)
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
            active_model.updated_at = ActiveValue::Set(chrono::Utc::now().to_rfc3339());

            self.kanban_column_repository
                .update(active_model)
                .await
                .unwrap();

            println!("Kanban column edited successfully.");
        } else {
            println!("Kanban column not found.");
        }
    }

    pub async fn order(&self, context_id: u32, orders: Vec<OrderRequest>) {
        println!("Updating kanban column order for context: {context_id}...");

        let columns = self.kanban_column_repository.get(context_id).await.unwrap();

        let order_map: HashMap<i32, i32> = orders.into_iter()
            .map(|order| (order.id, order.position)).collect();

        let columns: Vec<models::kanban_column::ActiveModel> = columns
            .into_iter()
            .map(|(column, _)| match order_map.get(&column.id) {
                Some(position) => {
                    let mut active_model: models::kanban_column::ActiveModel = column.into();
                    active_model.position = ActiveValue::Set(*position);
                    active_model
                }
                None => column.into(),
            })
            .collect();

        println!("Updating column positions in DB...");

        self.kanban_column_repository.update_order(columns).await.unwrap();

        println!("Kanban column order updated successfully.");
    }

    pub async fn delete(&self, column_id: i32) {
        println!("Deleting kanban column: {column_id}...");

        self.kanban_column_repository
            .delete(column_id)
            .await
            .unwrap();

        println!("Kanban column deleted successfully.");
    }
}
