use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "kanban_column")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,

    pub name: String,

    pub position: i32,

    pub context_id: i32,

    pub updated_at: String,

    pub created_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::context::Entity",
        from = "Column::ContextId",
        to = "super::context::Column::Id"
    )]
    Context,

    #[sea_orm(has_many = "super::task::Entity")]
    Tasks,
}

impl Related<super::context::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Context.def()
    }
}

impl Related<super::task::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tasks.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
