use tauri::State;

use crate::{
    app::AppState, dto::kanban_column::{KanbanColumnRequest, KanbanColumnResponse}, models::OrderRequest,
};

#[tauri::command]
pub async fn get_kanban_columns(
    context_id: u32,
    state: State<'_, AppState>,
) -> Result<Vec<KanbanColumnResponse>, ()> {
    let columns = state.kanban_column_service().get(context_id).await;
    Ok(columns)
}

#[tauri::command]
pub async fn add_kanban_column(
    kanban_column: KanbanColumnRequest,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    state.kanban_column_service().add(kanban_column).await;
    Ok(())
}

#[tauri::command]
pub async fn edit_kanban_column(
    kanban_column_id: i32,
    kanban_column: KanbanColumnRequest,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    state
        .kanban_column_service()
        .edit(kanban_column_id, kanban_column)
        .await;
    Ok(())
}

#[tauri::command]
pub async fn order_kanban_columns(context_id: u32, orders: Vec<OrderRequest>, state: State<'_, AppState>) -> Result<(), ()> {
    state.kanban_column_service().order(context_id, orders).await;
    Ok(())
}

#[tauri::command]
pub async fn delete_kanban_column(kanban_column_id: i32, state: State<'_, AppState>) -> Result<(), ()> {
    state.kanban_column_service().delete(kanban_column_id).await;
    Ok(())
}
