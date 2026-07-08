use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct ContextRequest {
    pub name: String,
}

#[derive(Debug, Serialize)]
pub struct ContextResponse {
    pub id: i32,
    pub name: String,
}
