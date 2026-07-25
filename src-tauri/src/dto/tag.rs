use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TagRequest {
    pub name: String,
    pub color: String,
}

#[derive(Debug, Serialize)]
pub struct TagResponse {
    pub id: i32,
    pub name: String,
    pub color: String,
}
