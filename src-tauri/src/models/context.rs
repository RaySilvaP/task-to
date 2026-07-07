use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "context")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::kanban_column::Entity")]
    KanbanColumns,
}

impl Related<super::kanban_column::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::KanbanColumns.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
