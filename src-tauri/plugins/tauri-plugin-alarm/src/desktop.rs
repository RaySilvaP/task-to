use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<Alarm<R>> {
  Ok(Alarm(app.clone()))
}

/// Access to the alarm APIs.
pub struct Alarm<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Alarm<R> {
  pub fn schedule(&self, payload: AlarmScheduleRequest) -> crate::Result<()> {
    Ok(())
  }

  pub fn cancel(&self, payload: AlarmCancelRequest) -> crate::Result<()> {
    Ok(())
  }
}
