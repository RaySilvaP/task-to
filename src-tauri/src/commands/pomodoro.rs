use tauri::AppHandle;

use crate::{app::AppState, models::pomodoro::SessionType};

#[tauri::command]
pub fn schedule_session(session_type: SessionType, ends_at: String, app: AppHandle) {
    AppState::alarm_service(&app).schedule_pomodoro_session(session_type, ends_at).unwrap();
}

#[tauri::command]
pub fn cancel_session(app: AppHandle) {
    AppState::alarm_service(&app).cancel_pomodoro_session().unwrap();
}
