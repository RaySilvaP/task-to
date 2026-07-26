use sea_orm::ActiveValue;

use crate::{
    dto::task::{TaskRequest, TaskResponse},
    models::task,
};

pub fn model_to_response(model: task::Model) -> TaskResponse {
    TaskResponse {
        id: model.id,
        name: model.name,
        position: model.position,
        kanban_column_id: model.kanban_column_id,
        due: model.due,
        priority: model.priority,
        tag_id: model.tag_id,
    }
}

pub fn request_to_active_model(request: TaskRequest) -> task::ActiveModel {
    task::ActiveModel {
        name: ActiveValue::Set(request.name),
        position: ActiveValue::Set(request.position),
        kanban_column_id: ActiveValue::Set(request.kanban_column_id),
        due: ActiveValue::Set(request.due),
        priority: ActiveValue::Set(request.priority),
        tag_id: ActiveValue::Set(request.tag_id),
        ..Default::default()
    }
}
