use serde::Deserialize;

pub mod context;
pub mod kanban_column;
pub mod task;

#[derive(Debug, Deserialize)]
pub struct OrderRequest {
    pub id: i32,
    pub position: i32,
}
