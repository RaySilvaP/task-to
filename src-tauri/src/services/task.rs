use crate::{dto::Task, repositories::task::TaskRepository};

pub struct TaskService<'a> {
    task_repository: TaskRepository<'a>
}

impl<'a> TaskService<'a> {
    pub fn new(task_repository: TaskRepository<'a>) -> Self {
        TaskService {
            task_repository
        }
    }

    pub fn get(&self) -> Vec<Task> {
        self.task_repository.get().unwrap()
    }
}
