import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import Task from '../models/task';
import Order from '../models/order';

@Injectable()
export class TaskService {

  public async get(nameFilter?: string, tagNameFilter?: string) {
    return await invoke<Task[]>('get_tasks', { nameFilter, tagNameFilter })
  }

  public async add(task: Task) {
    await invoke('add_task', { task });
  }

  public async edit(task: Task) {
    await invoke('edit_task', { taskId: task.id, task });
  }

  public async order(kanbanColumnId: number, orders: Order[]) {
    await invoke('order_tasks', { kanbanColumnId, orders });
  }

  public async delete(taskId: number) {
    await invoke('delete_task', { taskId });
  }
}
