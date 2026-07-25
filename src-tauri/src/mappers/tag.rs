use sea_orm::ActiveValue;

use crate::{
    dto::tag::{TagRequest, TagResponse},
    models::tag,
};

pub fn model_to_response(model: tag::Model) -> TagResponse {
    TagResponse {
        id: model.id,
        name: model.name,
        color: model.color,
    }
}

pub fn request_to_active_model(request: TagRequest) -> tag::ActiveModel {
    tag::ActiveModel {
        name: ActiveValue::Set(request.name),
        color: ActiveValue::Set(request.color),
        ..Default::default()
    }
}
