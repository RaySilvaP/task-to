use tauri::State;

use crate::{
    app::AppState,
    dto::task::TaskResponse,
};

#[tauri::command]
pub async fn get_average_duration(
    state: State<'_, AppState>,
) -> Result<f64, ()> {
    let avg = state.statistics_service().get_average_duration().await;
    Ok(avg)
}

#[tauri::command]
pub async fn get_tasks_by_week(
    date: String,
    state: State<'_, AppState>,
) -> Result<Vec<TaskResponse>, ()> {
    let tasks = state.statistics_service().get_tasks_by_week(&date).await;
    Ok(tasks)
}
