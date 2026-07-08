use migration::{Migrator, MigratorTrait};
use sea_orm::{DatabaseConnection, DbErr};

pub struct Database {
    conn: DatabaseConnection,
}

impl Database {
    pub async fn new(path: &str) -> Result<Self, DbErr> {
        let conn = sea_orm::Database::connect(&format!("sqlite://{path}?mode=rwc")).await?;
        Migrator::up(&conn, None).await?;
        Ok(Self {
            conn
        })
    }

    pub fn connection(&self) -> &DatabaseConnection {
        &self.conn
    }
}
