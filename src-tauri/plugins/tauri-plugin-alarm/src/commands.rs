use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::AlarmExt;

#[command]
pub(crate) async fn schedule<R: Runtime>(
    app: AppHandle<R>,
    payload: AlarmScheduleRequest,
) -> Result<()> {
    app.alarm().schedule(payload)
}

#[command]
pub(crate) async fn cancel<R: Runtime>(
    app: AppHandle<R>,
    payload: AlarmCancelRequest,
) -> Result<()> {
    app.alarm().cancel(payload)
}
