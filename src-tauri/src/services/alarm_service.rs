use std::error;

use tauri::AppHandle;
use tauri_plugin_alarm::{AlarmCancelRequest, AlarmExt, AlarmScheduleRequest};

use crate::{
    dto::{task::TaskRequest, time_block::TimeBlockRequest},
    models::pomodoro::SessionType::{self, Work},
};

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
            route: Some("/timeline".to_owned()),
        };

        self.app.alarm().schedule(alarm_schedule_request)?;

        Ok(())
    }

    pub fn schedule_task(
        &self,
        task_id: i32,
        task: TaskRequest,
    ) -> Result<(), Box<dyn error::Error>> {
        if let Some(due) = task.due {
            let alarm_schedule_request = AlarmScheduleRequest {
                notification_id: format!("task:{task_id}"),
                trigger_at: format!("{due}T00:00:00.000Z"),
                message: format!("You have a task scheduled: {}", task.name),
                route: Some("/kanban".to_owned()),
            };

            self.app.alarm().schedule(alarm_schedule_request)?;
        }

        Ok(())
    }

    pub fn schedule_pomodoro_session(
        &self,
        session_type: SessionType,
        ends_at: String,
    ) -> Result<(), Box<dyn error::Error>> {
        let alarm_service_request = AlarmScheduleRequest {
            notification_id: "pomodoro".to_owned(),
            trigger_at: ends_at,
            message: match session_type {
                Work => "Work session ended. Click here to start a rest session.".to_owned(),
                _ => "Rest session ended. Click here to start a work session".to_owned(),
            },
            route: Some("/pomodoro".to_owned()),
        };

        self.app.alarm().schedule(alarm_service_request)?;

        Ok(())
    }

    pub fn cancel_time_block(&self, block_id: i32) -> Result<(), Box<dyn error::Error>> {
        let alarm_cancel_request = AlarmCancelRequest {
            notification_id: format!("time_block:{block_id}"),
        };

        self.app.alarm().cancel(alarm_cancel_request)?;

        Ok(())
    }

    pub fn cancel_task(&self, task_id: i32) -> Result<(), Box<dyn error::Error>> {
        let alarm_cancel_request = AlarmCancelRequest {
            notification_id: format!("task:{task_id}"),
        };

        self.app.alarm().cancel(alarm_cancel_request)?;

        Ok(())
    }

    pub fn cancel_pomodoro_session(&self) -> Result<(), Box<dyn error::Error>> {
        let alarm_cancel_request = AlarmCancelRequest {
            notification_id: "pomodoro".to_owned(),
        };

        self.app.alarm().cancel(alarm_cancel_request)?;

        Ok(())
    }
}
