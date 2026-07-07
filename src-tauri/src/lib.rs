use tauri::Manager;

use crate::{app::AppState, database::Database};

const DB_FILENAME: &str = "database.db";

pub mod app;
pub mod commands;
pub mod database;
pub mod models;
pub mod repositories;
pub mod services;
pub mod dto;
pub mod mappers;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                let mut app_dir = app.path().app_data_dir().unwrap();
                app_dir.push(DB_FILENAME);
                let database = Database::new(app_dir.to_str().unwrap()).await.unwrap();
                app.manage(AppState::new(database));
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::task::get_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
