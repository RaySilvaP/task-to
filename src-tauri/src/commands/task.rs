use tauri::State;

use crate::{app::AppState, dto::Task};

#[tauri::command]
pub fn get_tasks(state: State<'_, AppState>) -> Vec<Task> {
    state.task_service().get()
}
