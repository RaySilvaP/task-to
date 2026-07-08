use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TaskRequest {
    pub name: String,
    pub position: i32,
    pub kanban_column_id: i32,
    pub due: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TaskResponse {
    pub id: i32,
    pub name: String,
    pub position: i32,
    pub kanban_column_id: i32,
    pub due: Option<String>,
}
