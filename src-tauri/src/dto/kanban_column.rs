use serde::{Deserialize, Serialize};

use crate::dto::task::TaskResponse;

#[derive(Debug, Deserialize)]
pub struct KanbanColumnRequest {
    pub name: String,
    pub position: i32,
    pub context_id: i32,
}

#[derive(Debug, Serialize)]
pub struct KanbanColumnResponse {
    pub id: i32,
    pub name: String,
    pub position: i32,
    pub context_id: i32,
    pub tasks: Vec<TaskResponse>,
}
