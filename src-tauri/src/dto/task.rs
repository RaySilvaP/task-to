use serde::{Deserialize, Serialize};

use crate::models::task::TaskPriority;

#[derive(Debug, Deserialize, Clone)]
pub struct TaskRequest {
    pub name: String,
    pub position: i32,
    pub kanban_column_id: i32,
    pub due: Option<String>,
    pub priority: Option<TaskPriority>,
    pub tag_id: Option<i32>,
}

#[derive(Debug, Serialize)]
pub struct TaskResponse {
    pub id: i32,
    pub name: String,
    pub position: i32,
    pub kanban_column_id: i32,
    pub due: Option<String>,
    pub priority: Option<TaskPriority>,
    pub tag_id: Option<i32>,
}
