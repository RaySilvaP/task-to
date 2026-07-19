use sea_orm::ActiveValue;

use crate::{
    dto::time_block::{TimeBlockRequest, TimeBlockResponse},
    models::time_block,
};

pub fn model_to_response(model: time_block::Model) -> TimeBlockResponse {
    TimeBlockResponse {
        id: model.id,
        name: model.name,
        start_date_time: model.start_date_time,
        duration: model.duration,
        task_id: model.task_id,
        overlap_order: model.overlap_order,
    }
}

pub fn request_to_active_model(request: TimeBlockRequest) -> time_block::ActiveModel {
    time_block::ActiveModel {
        name: ActiveValue::Set(request.name),
        start_date_time: ActiveValue::Set(request.start_date_time),
        duration: ActiveValue::Set(request.duration),
        task_id: ActiveValue::Set(request.task_id),
        overlap_order: ActiveValue::Set(request.overlap_order),
        ..Default::default()
    }
}
