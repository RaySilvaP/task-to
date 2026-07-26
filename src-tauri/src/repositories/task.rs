use sea_orm::{
    ActiveModelTrait, ColumnTrait, Condition, DbErr, EntityTrait, JoinType, QueryFilter,
    QuerySelect, RelationTrait, TransactionTrait,
};

use crate::{database::Database, models::{task, tag}};

pub struct TaskRepository<'a> {
    db: &'a Database,
}

impl<'a> TaskRepository<'a> {
    pub fn new(db: &'a Database) -> Self {
        TaskRepository { db }
    }

    pub async fn get_all(&self, name_filter: Option<String>, tag_name_filter: Option<String>) -> Result<Vec<task::Model>, DbErr> {
        let mut query = task::Entity::find()
            .join(JoinType::LeftJoin, task::Relation::Tag.def());

        let mut conditions = Condition::any();
        if let Some(name) = name_filter {
            conditions = conditions.add(task::Column::Name.contains(&name));
        }
        if let Some(tag_name) = tag_name_filter {
            conditions = conditions.add(tag::Column::Name.contains(&tag_name));
        }

        if !conditions.is_empty() {
            query = query.filter(conditions);
        }

        query.all(self.db.connection()).await
    }

    pub async fn get(&self, kanban_column_id: i32) -> Result<Vec<task::Model>, DbErr> {
        task::Entity::find()
            .filter(task::Column::KanbanColumnId.eq(kanban_column_id))
            .all(self.db.connection())
            .await
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

    pub async fn update_order(&self, tasks: Vec<task::ActiveModel>) -> Result<(), DbErr> {
        let txn = self.db.connection().begin().await?;

        for task in tasks {
            task.update(&txn).await?;
        }

        txn.commit().await
    }

    pub async fn delete(&self, id: i32) -> Result<(), DbErr> {
        task::Entity::delete_by_id(id)
            .exec(self.db.connection())
            .await?;
        Ok(())
    }
}
