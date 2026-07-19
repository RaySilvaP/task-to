use std::collections::HashMap;

use sea_orm::ActiveValue;

use crate::{
    dto::task::{TaskRequest, TaskResponse},
    mappers::task,
    models::{self, OrderRequest},
    repositories::task::TaskRepository,
};

pub struct TaskService<'a> {
    task_repository: TaskRepository<'a>,
}

impl<'a> TaskService<'a> {
    pub fn new(task_repository: TaskRepository<'a>) -> Self {
        TaskService { task_repository }
    }

    pub async fn get_all(&self, name_filter: Option<String>) -> Vec<TaskResponse> {
        println!("Getting tasks filtered by name: {name_filter:?}...");

        let tasks = self
            .task_repository
            .get_all(name_filter)
            .await
            .unwrap();

        println!("Tasks retrieved successfully.");

        tasks.into_iter().map(task::model_to_response).collect()
    }

    pub async fn get(&self, kanban_column_id: i32) -> Vec<TaskResponse> {
        println!("Getting tasks for kanban column: {kanban_column_id}...");

        let tasks = self
            .task_repository
            .get(kanban_column_id)
            .await
            .unwrap();

        println!("Tasks retrieved successfully.");

        tasks.into_iter().map(task::model_to_response).collect()
    }

    pub async fn add(&self, request: TaskRequest) {
        println!("Adding new task...");

        let now = chrono::Utc::now().to_rfc3339();
        let mut active_model = task::request_to_active_model(request);
        active_model.created_at = ActiveValue::Set(now.clone());
        active_model.updated_at = ActiveValue::Set(now);

        let task = self
            .task_repository
            .add(active_model)
            .await
            .unwrap();

        println!("Task added successfully: {}", task.id);
    }

    pub async fn delete(&self, task_id: i32) {
        println!("Deleting task: {task_id}...");

        self.task_repository.delete(task_id).await.unwrap();

        println!("Task deleted successfully.");
    }

    pub async fn edit(&self, task_id: i32, request: TaskRequest) {
        println!("Getting task: {task_id}...");
        if let Some(task) = self.task_repository.get_by_id(task_id).await.unwrap() {
            println!("Editing task...");
            let mut active_model: models::task::ActiveModel = task.into();

            active_model.name = ActiveValue::Set(request.name);
            active_model.position = ActiveValue::Set(request.position);
            active_model.kanban_column_id = ActiveValue::Set(request.kanban_column_id);
            active_model.due = ActiveValue::Set(request.due);
            active_model.updated_at = ActiveValue::Set(chrono::Utc::now().to_rfc3339());

            self.task_repository.update(active_model).await.unwrap();

            println!("Task edited successfully.");
        } else {
            println!("Task not found");
        }
    }

    pub async fn order(&self, kanban_column_id: i32, orders: Vec<OrderRequest>) {
        println!("Updating task order for kanban column: {kanban_column_id}...");

        let tasks = self.task_repository.get(kanban_column_id).await.unwrap();

        let order_map: HashMap<i32, i32> = orders
            .into_iter()
            .map(|order| (order.id, order.position))
            .collect();

        println!("Order map: {:?}", order_map);

        let tasks: Vec<models::task::ActiveModel> = tasks
            .into_iter()
            .map(|task| match order_map.get(&task.id) {
                Some(position) => {
                    let mut active_model: models::task::ActiveModel = task.into();
                    active_model.position = ActiveValue::Set(*position);
                    active_model
                }
                None => task.into(),
            })
            .collect();

        println!("Updating task positions in DB...");

        self.task_repository.update_order(tasks).await.unwrap();

        println!("Task order updated successfully.");
    }
}
