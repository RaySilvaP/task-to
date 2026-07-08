use sea_orm::ActiveValue;

use crate::{dto::task::TaskRequest, mappers::task, models, repositories::task::TaskRepository};

pub struct TaskService<'a> {
    task_repository: TaskRepository<'a>,
}

impl<'a> TaskService<'a> {
    pub fn new(task_repository: TaskRepository<'a>) -> Self {
        TaskService { task_repository }
    }

    pub async fn add(&self, request: TaskRequest) {
        println!("Adding new task...");

        let task = self
            .task_repository
            .add(task::request_to_active_model(request))
            .await
            .unwrap();

        println!("Task added successfully: {}", task.id);
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

            self.task_repository.update(active_model).await.unwrap();

            println!("Task edited successfully.");
        } else {
            println!("Task not found");
        }
    }
}
