use sea_orm::ActiveValue;

use crate::{
    dto::context::{ContextRequest, ContextResponse},
    models::context,
};

pub fn model_to_response(model: context::Model) -> ContextResponse {
    ContextResponse {
        id: model.id,
        name: model.name,
    }
}

pub fn request_to_active_model(request: ContextRequest) -> context::ActiveModel {
    context::ActiveModel {
        name: ActiveValue::Set(request.name),
        ..Default::default()
    }
}
