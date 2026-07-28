use tauri::{AppHandle, State};

use crate::{
    app::AppState,
    dto::time_block::{TimeBlockRequest, TimeBlockResponse},
};

#[tauri::command]
pub async fn get_time_blocks_by_day(
    date: String,
    state: State<'_, AppState>,
) -> Result<Vec<TimeBlockResponse>, ()> {
    let blocks = state.time_block_service().get_by_day(&date).await;
    Ok(blocks)
}

#[tauri::command]
pub async fn add_time_block(
    time_block: TimeBlockRequest,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), ()> {
    let block_id = state.time_block_service().add(time_block.clone()).await;

    AppState::alarm_service(&app)
        .schedule_time_block(block_id, time_block)
        .unwrap();

    Ok(())
}

#[tauri::command]
pub async fn edit_time_block(
    block_id: i32,
    time_block: TimeBlockRequest,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), ()> {
    state.time_block_service().edit(block_id, time_block.clone()).await;

    let alarm_service = AppState::alarm_service(&app);
    alarm_service.cancel_time_block(block_id).unwrap();
    alarm_service
        .schedule_time_block(block_id, time_block)
        .unwrap();

    Ok(())
}

#[tauri::command]
pub async fn delete_time_block(
    block_id: i32,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<(), ()> {
    state.time_block_service().delete(block_id).await;

    AppState::alarm_service(&app)
        .cancel_time_block(block_id)
        .unwrap();

    Ok(())
}
