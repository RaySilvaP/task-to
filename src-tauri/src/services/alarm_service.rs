use std::error;

use tauri::AppHandle;
use tauri_plugin_alarm::{AlarmCancelRequest, AlarmExt, AlarmScheduleRequest};

use crate::dto::time_block::TimeBlockRequest;

pub struct AlarmService<'a> {
    app: &'a AppHandle,
}

impl<'a> AlarmService<'a> {
    pub fn new(app: &'a AppHandle) -> Self {
        Self { app }
    }

    pub fn schedule_time_block(
        &self,
        block_id: i32,
        time_block: TimeBlockRequest,
    ) -> Result<(), Box<dyn error::Error>> {
        let alarm_schedule_request = AlarmScheduleRequest {
            notification_id: format!("time_block:{block_id}"),
            trigger_at: time_block.start_date_time,
            message: format!("You have a time block scheduled: {}", time_block.name,),
        };

        self.app.alarm().schedule(alarm_schedule_request)?;

        Ok(())
    }

    pub fn cancel_time_block(&self, block_id: i32) -> Result<(), Box<dyn error::Error>> {
        let alarm_cancel_request = AlarmCancelRequest {
            notification_id: format!("time_block:{block_id}"),
        };

        self.app.alarm().cancel(alarm_cancel_request)?;

        Ok(())
    }
}
