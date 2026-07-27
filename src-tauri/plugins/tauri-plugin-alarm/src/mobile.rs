use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<Alarm<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.ray.task_to.plugin.alarm", "ExamplePlugin")?;
  Ok(Alarm(handle))
}

/// Access to the alarm APIs.
pub struct Alarm<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Alarm<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    self
      .0
      .run_mobile_plugin("ping", payload)
      .map_err(Into::into)
  }
}
