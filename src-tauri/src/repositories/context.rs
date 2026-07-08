use sea_orm::{ActiveModelTrait, DbErr, EntityTrait};

use crate::{database::Database, models::context};

pub struct ContextRepository<'a> {
    db: &'a Database,
}

impl<'a> ContextRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub async fn get_by_id(&self, id: i32) -> Result<Option<context::Model>, DbErr> {
        context::Entity::find_by_id(id)
            .one(self.db.connection())
            .await
    }

    pub async fn get(&self) -> Result<Vec<context::Model>, DbErr> {
        let contexts = context::Entity::find().all(self.db.connection()).await?;

        Ok(contexts)
    }

    pub async fn add(&self, context: context::ActiveModel) -> Result<context::Model, DbErr> {
        context.insert(self.db.connection()).await
    }

    pub async fn update(&self, context: context::ActiveModel) -> Result<context::Model, DbErr> {
       context.update(self.db.connection()).await 
    }
}
