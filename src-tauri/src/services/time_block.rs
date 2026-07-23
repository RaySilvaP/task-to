use chrono::Utc;
use sea_orm::ActiveValue;

use crate::{
    dto::time_block::{TimeBlockRequest, TimeBlockResponse},
    mappers::time_block,
    models::time_block as time_block_model,
    repositories::time_block::TimeBlockRepository,
};

pub struct TimeBlockService<'a> {
    time_block_repository: TimeBlockRepository<'a>,
}

impl<'a> TimeBlockService<'a> {
    pub fn new(time_block_repository: TimeBlockRepository<'a>) -> Self {
        TimeBlockService {
            time_block_repository,
        }
    }

    pub async fn get_by_day(&self, date: &str) -> Vec<TimeBlockResponse> {
        println!("Getting time blocks for date: {date}...");

        let date_utc = chrono::DateTime::parse_from_rfc3339(date).unwrap();
        let end_date_utc = date_utc + chrono::Duration::days(1);

        let blocks = self
            .time_block_repository
            .get_by_day(
                date_utc.with_timezone(&Utc),
                end_date_utc.with_timezone(&Utc),
            )
            .await
            .unwrap();

        println!("Time blocks retrieved successfully.");

        blocks
            .into_iter()
            .map(time_block::model_to_response)
            .collect()
    }

    pub async fn add(&self, request: TimeBlockRequest) {
        println!("Adding new time block...");

        let now = chrono::Utc::now().to_rfc3339();
        let mut active_model = time_block::request_to_active_model(request);
        active_model.created_at = ActiveValue::Set(now.clone());
        active_model.updated_at = ActiveValue::Set(now);

        let block = self.time_block_repository.add(active_model).await.unwrap();

        println!("Time block added successfully: {}", block.id);
    }

    pub async fn edit(&self, block_id: i32, request: TimeBlockRequest) {
        println!("Editing time block: {block_id}...");
        if let Some(block) = self
            .time_block_repository
            .get_by_id(block_id)
            .await
            .unwrap()
        {
            println!("Time block found, updating...");
            let mut active_model: time_block_model::ActiveModel = block.into();

            active_model.name = ActiveValue::Set(request.name);
            active_model.start_date_time = ActiveValue::Set(request.start_date_time);
            active_model.duration = ActiveValue::Set(request.duration);
            active_model.task_id = ActiveValue::Set(request.task_id);
            active_model.overlap_order = ActiveValue::Set(request.overlap_order);
            active_model.updated_at = ActiveValue::Set(chrono::Utc::now().to_rfc3339());

            self.time_block_repository
                .update(active_model)
                .await
                .unwrap();
            println!("Time block edited successfully.");
        } else {
            println!("Time block not found");
        }
    }

    pub async fn delete(&self, block_id: i32) {
        println!("Deleting time block: {block_id}...");
        self.time_block_repository.delete(block_id).await.unwrap();
        println!("Time block deleted successfully.");
    }
}
