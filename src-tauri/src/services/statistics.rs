use chrono::Datelike;

use crate::{
    dto::task::TaskResponse,
    mappers::task,
    repositories::{task::TaskRepository, time_block::TimeBlockRepository},
};

pub struct StatisticsService<'a> {
    time_block_repository: TimeBlockRepository<'a>,
    task_repository: TaskRepository<'a>,
}

impl<'a> StatisticsService<'a> {
    pub fn new(
        time_block_repository: TimeBlockRepository<'a>,
        task_repository: TaskRepository<'a>,
    ) -> Self {
        StatisticsService {
            time_block_repository,
            task_repository,
        }
    }

    pub async fn get_average_duration(&self) -> f64 {
        println!("Getting average time block duration...");

        let blocks = self
            .time_block_repository
            .get_all()
            .await
            .unwrap();

        if blocks.is_empty() {
            println!("No time blocks found, average duration is 0.");
            return 0.0;
        }

        let sum: i32 = blocks.iter().map(|b| b.duration).sum();
        let average = sum as f64 / blocks.len() as f64;

        println!("Average time block duration: {average} min");
        average
    }

    pub async fn get_tasks_by_week(&self, date: &str) -> Vec<TaskResponse> {
        println!("Getting tasks for week of: {date}...");

        let date_naive = chrono::DateTime::parse_from_rfc3339(date).unwrap().date_naive();
        let weekday = date_naive.weekday().number_from_monday();

        let monday = date_naive - chrono::Duration::days((weekday - 1) as i64);
        let next_monday = monday + chrono::Duration::days(7);

        let start = monday.format("%Y-%m-%d").to_string();
        let end = next_monday.format("%Y-%m-%d").to_string();

        let tasks = self
            .task_repository
            .get_by_due_date_range(&start, &end)
            .await
            .unwrap();

        println!("Tasks retrieved successfully.");

        tasks.into_iter().map(task::model_to_response).collect()
    }
}
