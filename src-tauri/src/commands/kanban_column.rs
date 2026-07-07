use tauri::State;

use crate::{app::AppState, dto::KanbanColumn};

#[tauri::command]
pub async fn get_kanban_columns(context_id: u32, state: State<'_, AppState>) -> Result<Vec<KanbanColumn>, ()> {
    let columns = state.kanban_column_service().get_columns(context_id).await;
    Ok(columns)
}
