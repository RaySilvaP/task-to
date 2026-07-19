use sea_orm::{ActiveModelTrait, ColumnTrait, DbErr, EntityTrait, QueryFilter};

use crate::{database::Database, models::time_block};

pub struct TimeBlockRepository<'a> {
    db: &'a Database,
}

impl<'a> TimeBlockRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        TimeBlockRepository { db }
    }

    pub async fn get_by_day(&self, date: &str) -> Result<Vec<time_block::Model>, DbErr> {
        time_block::Entity::find()
            .filter(time_block::Column::StartDateTime.starts_with(date))
            .all(self.db.connection())
            .await
    }

    pub async fn get_by_id(&self, id: i32) -> Result<Option<time_block::Model>, DbErr> {
        time_block::Entity::find_by_id(id).one(self.db.connection()).await
    }

    pub async fn add(&self, block: time_block::ActiveModel) -> Result<time_block::Model, DbErr> {
        block.insert(self.db.connection()).await
    }

    pub async fn update(&self, block: time_block::ActiveModel) -> Result<time_block::Model, DbErr> {
        block.update(self.db.connection()).await
    }

    pub async fn delete(&self, id: i32) -> Result<(), DbErr> {
        time_block::Entity::delete_by_id(id)
            .exec(self.db.connection())
            .await?;
        Ok(())
    }
}
