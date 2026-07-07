use crate::{
    dto::{KanbanColumn, Task},
    models::kanban_column,
};

pub fn model_to_dto(model: kanban_column::Model, tasks: Vec<Task>) -> KanbanColumn {
    KanbanColumn {
        id: model.id,
        name: model.name,
        position: model.position,
        context_id: model.context_id,
        tasks,
    }
}
