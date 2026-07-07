use sea_orm::{DatabaseConnection, DbErr};

pub struct Database {
    conn: DatabaseConnection,
}

impl Database {
    pub async fn new(path: &str) -> Result<Self, DbErr> {
        Ok(Self {
            conn: sea_orm::Database::connect(&format!("sqlite://{path}?mode=rwc")).await?,
        })
    }

    pub fn connection(&self) -> &DatabaseConnection {
        &self.conn
    }
}
