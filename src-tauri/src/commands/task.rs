use tauri::{AppHandle, State};

use crate::{
    app::AppState,
    dto::task::{TaskRequest, TaskResponse},
    models::OrderRequest,
};

#[tauri::command]
pub async fn get_tasks(
    name_filter: Option<String>,
    tag_name_filter: Option<String>,
    state: State<'_, AppState>,
) -> Result<Vec<TaskResponse>, ()> {
    let tasks = state
        .task_service()
        .get_all(name_filter, tag_name_filter)
        .await;
    Ok(tasks)
}

#[tauri::command]
pub async fn get_task(
    task_id: i32,
    state: State<'_, AppState>,
) -> Result<Option<TaskResponse>, ()> {
    Ok(state.task_service().get_by_id(task_id).await)
}

#[tauri::command]
pub async fn add_task(
    task: TaskRequest,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), ()> {
    let task_id = state.task_service().add(task.clone()).await;

    AppState::alarm_service(&app)
        .schedule_task(task_id, task)
        .unwrap();

    Ok(())
}

#[tauri::command]
pub async fn edit_task(
    task_id: i32,
    task: TaskRequest,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), ()> {
    state.task_service().edit(task_id, task.clone()).await;

    let alarm_service = AppState::alarm_service(&app);
    alarm_service.cancel_task(task_id).unwrap();
    alarm_service.schedule_task(task_id, task).unwrap();

    Ok(())
}

#[tauri::command]
pub async fn order_tasks(
    kanban_column_id: i32,
    orders: Vec<OrderRequest>,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    state.task_service().order(kanban_column_id, orders).await;
    Ok(())
}

#[tauri::command]
pub async fn delete_task(task_id: i32, state: State<'_, AppState>, app: AppHandle) -> Result<(), ()> {
    state.task_service().delete(task_id).await;

    AppState::alarm_service(&app).cancel_task(task_id).unwrap();

    Ok(())
}
