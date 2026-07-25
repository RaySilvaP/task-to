pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20260719_021502_create_time_block_table;
mod m20260724_171041_add_task_priority;
mod m20260724_190626_remove_restrict_delete_constrain;
mod m20260725_142231_delete_task_with_time_blocks;
mod m20260725_201444_create_tag_table;
mod m20260725_211244_add_missing_columns_to_tag;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20260719_021502_create_time_block_table::Migration),
            Box::new(m20260724_171041_add_task_priority::Migration),
            Box::new(m20260724_190626_remove_restrict_delete_constrain::Migration),
            Box::new(m20260725_142231_delete_task_with_time_blocks::Migration),
            Box::new(m20260725_201444_create_tag_table::Migration),
            Box::new(m20260725_211244_add_missing_columns_to_tag::Migration),
        ]
    }
}
