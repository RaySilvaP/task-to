use tauri::State;

use crate::{
    app::AppState,
    dto::context::{ContextRequest, ContextResponse},
};

#[tauri::command]
pub async fn get_contexts(state: State<'_, AppState>) -> Result<Vec<ContextResponse>, ()> {
    let contexts = state.context_service().get().await;
    Ok(contexts)
}

#[tauri::command]
pub async fn add_context(context: ContextRequest, state: State<'_, AppState>) -> Result<(), ()> {
    state.context_service().add(context).await;
    Ok(())
}

#[tauri::command]
pub async fn edit_context(
    context_id: i32,
    context: ContextRequest,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    state.context_service().edit(context_id, context).await;
    Ok(())
}
