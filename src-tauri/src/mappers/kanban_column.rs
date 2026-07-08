use sea_orm::ActiveValue;

use crate::{
    dto::{kanban_column::{KanbanColumnRequest, KanbanColumnResponse}, task::TaskResponse}, models::kanban_column,
};

pub fn model_to_response(model: kanban_column::Model, tasks: Vec<TaskResponse>) -> KanbanColumnResponse {
    KanbanColumnResponse {
        id: model.id,
        name: model.name,
        position: model.position,
        context_id: model.context_id,
        tasks,
    }
}

pub fn request_to_active_model(request: KanbanColumnRequest) -> kanban_column::ActiveModel {
    kanban_column::ActiveModel {
        name: ActiveValue::Set(request.name),
        position: ActiveValue::Set(request.position),
        context_id: ActiveValue::Set(request.context_id),
        ..Default::default()
    }
}
