use sea_orm::{ActiveModelTrait, DbErr, EntityTrait};

use crate::{database::Database, models::tag};

pub struct TagRepository<'a> {
    db: &'a Database,
}

impl<'a> TagRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub async fn get_by_id(&self, id: i32) -> Result<Option<tag::Model>, DbErr> {
        tag::Entity::find_by_id(id)
            .one(self.db.connection())
            .await
    }

    pub async fn get(&self) -> Result<Vec<tag::Model>, DbErr> {
        tag::Entity::find().all(self.db.connection()).await
    }

    pub async fn add(&self, tag: tag::ActiveModel) -> Result<tag::Model, DbErr> {
        tag.insert(self.db.connection()).await
    }

    pub async fn update(&self, tag: tag::ActiveModel) -> Result<tag::Model, DbErr> {
        tag.update(self.db.connection()).await
    }

    pub async fn delete(&self, id: i32) -> Result<(), DbErr> {
        tag::Entity::delete_by_id(id)
            .exec(self.db.connection())
            .await?;
        Ok(())
    }
}
