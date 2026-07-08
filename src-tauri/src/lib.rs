use tauri::Manager;

use crate::{app::AppState, database::Database};

const DB_FILENAME: &str = "database.db";

pub mod app;
pub mod commands;
pub mod database;
pub mod dto;
pub mod mappers;
pub mod models;
pub mod repositories;
pub mod services;

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
        .invoke_handler(tauri::generate_handler![
            commands::kanban_column::get_kanban_columns,
            commands::kanban_column::add_kanban_column,
            commands::kanban_column::edit_kanban_column,
            commands::context::get_contexts,
            commands::context::add_context,
            commands::context::edit_context,
            commands::task::add_task,
            commands::task::edit_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
