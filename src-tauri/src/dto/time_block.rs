use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TimeBlockRequest {
    pub name: String,
    pub start_date_time: String,
    pub duration: i32,
    pub task_id: Option<i32>,
    pub overlap_order: i32,
}

#[derive(Debug, Serialize)]
pub struct TimeBlockResponse {
    pub id: i32,
    pub name: String,
    pub start_date_time: String,
    pub duration: i32,
    pub task_id: Option<i32>,
    pub overlap_order: i32,
}
