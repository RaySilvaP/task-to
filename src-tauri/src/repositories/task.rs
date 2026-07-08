use sea_orm::{ActiveModelTrait, DbErr, EntityTrait};

use crate::{database::Database, models::task};

pub struct TaskRepository<'a> {
    db: &'a Database,
}

impl<'a> TaskRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        TaskRepository { db }
    }

    pub async fn get_by_id(&self, id: i32) -> Result<Option<task::Model>, DbErr> {
        task::Entity::find_by_id(id).one(self.db.connection()).await
    }

    pub async fn add(&self, task: task::ActiveModel) -> Result<task::Model, DbErr> {
        task.insert(self.db.connection()).await
    }

    pub async fn update(&self, task: task::ActiveModel) -> Result<task::Model, DbErr> {
        task.update(self.db.connection()).await
    }
}
