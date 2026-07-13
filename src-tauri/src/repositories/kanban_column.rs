use sea_orm::{
    ActiveModelTrait, ColumnTrait, DbErr, EntityTrait, Order, QueryFilter, QueryOrder, TransactionTrait,
};

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
            .order_by(kanban_column::Column::Position, Order::Asc)
            .find_with_related(task::Entity)
            .all(self.db.connection())
            .await?;

        let columns = columns
            .into_iter()
            .map(|(column, mut tasks)| {
                tasks.sort_by_key(|t| t.position);
                (column, tasks)
            })
            .collect();

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

    pub async fn update_order(&self, columns: Vec<kanban_column::ActiveModel>) -> Result<(), DbErr> {
        let txn = self.db.connection().begin().await?;

        for column in columns {
            column.update(&txn).await?;
        }

        txn.commit().await
    }

    pub async fn delete(&self, id: i32) -> Result<(), DbErr> {
        kanban_column::Entity::delete_by_id(id)
            .exec(self.db.connection())
            .await?;
        Ok(())
    }
}
