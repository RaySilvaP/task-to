use std::error::Error;

use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

use crate::{database::Database, models::{kanban_column, task}};

pub struct KanbanColumnRepository<'a> {
    db: &'a Database,
}

impl<'a> KanbanColumnRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub async fn get_columns(&self, context_id: u32) -> Result<Vec<(kanban_column::Model, Vec<task::Model>)>, Box<dyn Error>> {
        let columns = kanban_column::Entity::find()
            .filter(kanban_column::Column::ContextId.eq(context_id))
            .find_with_related(task::Entity)
            .all(self.db.connection())
            .await?;

        Ok(columns)
    }
}
