import { Component, inject, input, OnInit, signal } from '@angular/core';
import TimeBlock from '../../../../models/timeBlock';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../services/task-service';
import Task from '../../../../models/task';

@Component({
  selector: 'app-time-block-component',
  imports: [ReactiveFormsModule],
  templateUrl: './time-block-component.html',
  styleUrl: './time-block-component.css',
})
export class TimeBlockComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  protected task = signal<Task | null>(null);
  public timeBlock = input.required<TimeBlock>();

  async ngOnInit(): Promise<void> {
    if(this.timeBlock().task_id) {
      const task = await this.taskService.getById(this.timeBlock().task_id!);
      this.task.set(task);
    }
  }

  protected timeRange(): string {
    const block = this.timeBlock();
    const start = new Date(block.start_date_time);
    const end = new Date(start.getTime() + block.duration * 60_000);
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
