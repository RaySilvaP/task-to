use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Context {
    pub id: i32,
    pub name: String,
    pub kanban_columns: Vec<KanbanColumn>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct KanbanColumn {
    pub id: i32,
    pub name: String,
    pub position: i32,
    pub context_id: i32,
    pub tasks: Vec<Task>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Task {
    pub id: i32,
    pub name: String,
    pub position: i32,
    pub kanban_column_id: i32,
    pub due: Option<String>,
}
