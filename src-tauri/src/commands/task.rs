use tauri::State;

use crate::{app::AppState, dto::task::TaskRequest};

#[tauri::command]
pub async fn add_task(task: TaskRequest, state: State<'_, AppState>) -> Result<(), ()> {
    state.task_service().add(task).await;
    Ok(())
}

#[tauri::command]
pub async fn edit_task(task_id: i32, task: TaskRequest, state: State<'_, AppState>) -> Result<(), ()> {
    state.task_service().edit(task_id, task).await;
   Ok(()) 
}
