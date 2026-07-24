use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20260724_190626_remove_restrict_delete_constrain"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        _manager
            .get_connection()
            .execute_unprepared(include_str!("../sql/remove_restrict_delete_constrain.sql"))
            .await?;

        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        _manager
            .get_connection()
            .execute_unprepared(include_str!("../sql/add_restrict_delete_constrain.sql"))
            .await?;

        Ok(())
    }
}
