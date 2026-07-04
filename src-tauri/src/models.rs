use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Task {
    pub id: u32,
    pub name: String,
    pub due: Option<String>
}
