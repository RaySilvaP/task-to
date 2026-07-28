use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmScheduleRequest {
    pub notification_id: String,
    pub trigger_at: String,
    pub message: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmCancelRequest {
    pub notification_id: String
}

//#[derive(Debug, Clone, Default, Deserialize, Serialize)]
//#[serde(rename_all = "camelCase")]
//pub struct PingResponse {
  //pub value: Option<String>,
//}
