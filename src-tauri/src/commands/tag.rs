use tauri::State;

use crate::{
    app::AppState,
    dto::tag::{TagRequest, TagResponse},
};

#[tauri::command]
pub async fn get_tags(state: State<'_, AppState>) -> Result<Vec<TagResponse>, ()> {
    let tags = state.tag_service().get().await;
    Ok(tags)
}

#[tauri::command]
pub async fn add_tag(tag: TagRequest, state: State<'_, AppState>) -> Result<i32, ()> {
    let tag_id = state.tag_service().add(tag).await;
    Ok(tag_id)
}

#[tauri::command]
pub async fn edit_tag(tag_id: i32, tag: TagRequest, state: State<'_, AppState>) -> Result<(), ()> {
    state.tag_service().edit(tag_id, tag).await;
    Ok(())
}

#[tauri::command]
pub async fn delete_tag(tag_id: i32, state: State<'_, AppState>) -> Result<(), ()> {
    state.tag_service().delete(tag_id).await;
    Ok(())
}
