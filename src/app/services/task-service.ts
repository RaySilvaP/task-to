import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import Task from '../models/task';

@Injectable()
export class TaskService {

  public async add(task: Task) {
    await invoke('add_task', { task });
  }

  public async edit(task: Task) {
    await invoke('edit_task', { taskId: task.id, task });
  }
}
