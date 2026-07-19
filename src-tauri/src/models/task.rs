use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "task")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub name: String,

    pub position: i32,

    pub kanban_column_id: i32,

    pub due: Option<String>,

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
}

impl Related<super::kanban_column::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::KanbanColumn.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
