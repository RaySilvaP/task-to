use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(EnumIter, Clone, PartialEq, Debug, DeriveActiveEnum, Deserialize, Serialize)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(StringLen::None)",
    rename_all = "camelCase"
)]
pub enum TaskPriority {
    Low,
    Medium,
    High,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "task")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub name: String,

    pub position: i32,

    pub kanban_column_id: i32,

    pub due: Option<String>,

    pub priority: Option<TaskPriority>,

    pub tag_id: Option<i32>,

    pub updated_at: String,

    pub created_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::kanban_column::Entity",
        from = "Column::KanbanColumnId",
        to = "super::kanban_column::Column::Id"
    )]
    KanbanColumn,
    #[sea_orm(
        belongs_to = "super::tag::Entity",
        from = "Column::TagId",
        to = "super::tag::Column::Id"
    )]
    Tag,
}

impl Related<super::kanban_column::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::KanbanColumn.def()
    }
}

impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
