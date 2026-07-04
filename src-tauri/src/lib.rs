use std::sync::Mutex;

use rusqlite::Connection;
use tauri::Manager;

use crate::models::Task;

const DB_FILENAME: &str = "database.db";

mod models;
mod task_repository;

struct AppState {
    conn: Connection,
}

#[tauri::command]
fn get_tasks(app_state: tauri::State<Mutex<AppState>>) -> Vec<Task> {
    let state = app_state.lock().unwrap();
    task_repository::get(&state.conn).unwrap()
}

#[tauri::command]
fn add_task(app_state: tauri::State<Mutex<AppState>>, task: Task) {
    let state = app_state.lock().unwrap();
    task_repository::add(&state.conn, task).unwrap();
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let mut app_dir = app.path().app_data_dir()?;
            app_dir.push(DB_FILENAME);

            let conn = Connection::open(&app_dir)?;
            println!("Database connection established: {app_dir:?}");
            startup(&conn)?;
            println!("Tables created.");
            
            let state = Mutex::new(AppState { conn });
            app.manage(state);

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, add_task, get_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn startup(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS context (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS kanban_column (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position INTEGER NOT NULL,
        context_id INTEGER NOT NULL,

        CONSTRAINT FK_context FOREIGN KEY (context_id) REFERENCES context(id) ON DELETE RESTRICT
        );",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position INTEGER NOT NULL,
        kanban_column_id INTEGER NOT NULL,
        due TEXT,

        CONSTRAINT FK_kanban_column FOREIGN KEY (kanban_column_id) REFERENCES kanban_column(id) ON DELETE RESTRICT
        );",
        (),
    )?;

    Ok(())
}
