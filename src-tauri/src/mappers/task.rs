use crate::{dto::Task, models::task};

pub fn model_to_dto(model: task::Model) -> Task {
    Task {
        id: model.id,
        name: model.name,
        position: model.position,
        kanban_column_id: model.kanban_column_id,
        due: model.due,
    }
}
