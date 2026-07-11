use tauri::State;

use crate::{
    app::AppState,
    dto::task::{TaskRequest, TaskResponse},
};

#[tauri::command]
pub async fn get_tasks(
    kanban_column_id: i32,
    state: State<'_, AppState>,
) -> Result<Vec<TaskResponse>, ()> {
    let tasks = state.task_service().get(kanban_column_id).await;
    Ok(tasks)
}

#[tauri::command]
pub async fn add_task(task: TaskRequest, state: State<'_, AppState>) -> Result<(), ()> {
    state.task_service().add(task).await;
    Ok(())
}

#[tauri::command]
pub async fn edit_task(
    task_id: i32,
    task: TaskRequest,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    state.task_service().edit(task_id, task).await;
    Ok(())
}

#[tauri::command]
pub async fn delete_task(task_id: i32, state: State<'_, AppState>) -> Result<(), ()> {
    state.task_service().delete(task_id).await;
    Ok(())
}
