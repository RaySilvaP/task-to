use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20260725_211244_add_missing_columns_to_tag"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        _manager
            .get_connection()
            .execute_unprepared(include_str!("../sql/add_missing_columns_to_tag.sql"))
            .await?;

        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        _manager
            .get_connection()
            .execute_unprepared(include_str!("../sql/revert_add_missing_columns_to_tag.sql"))
            .await?;

        Ok(())
    }
}
