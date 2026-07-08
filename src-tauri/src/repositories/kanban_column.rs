use sea_orm::{ActiveModelTrait, ColumnTrait, DbErr, EntityTrait, QueryFilter};

use crate::{
    database::Database,
    models::{kanban_column, task},
};

pub struct KanbanColumnRepository<'a> {
    db: &'a Database,
}

impl<'a> KanbanColumnRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub async fn get_by_id(&self, id: i32) -> Result<Option<kanban_column::Model>, DbErr> {
        kanban_column::Entity::find_by_id(id)
            .one(self.db.connection())
            .await
    }

    pub async fn get(
        &self,
        context_id: u32,
    ) -> Result<Vec<(kanban_column::Model, Vec<task::Model>)>, DbErr> {
        let columns = kanban_column::Entity::find()
            .filter(kanban_column::Column::ContextId.eq(context_id))
            .find_with_related(task::Entity)
            .all(self.db.connection())
            .await?;

        Ok(columns)
    }

    pub async fn add(
        &self,
        column: kanban_column::ActiveModel,
    ) -> Result<kanban_column::Model, DbErr> {
        column.insert(self.db.connection()).await
    }

    pub async fn update(&self, column: kanban_column::ActiveModel) -> Result<kanban_column::Model, DbErr> {
        column.update(self.db.connection()).await
    }
}
