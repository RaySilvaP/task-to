import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import Task from '../../../models/task';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  public task = input.required<Task>();

  protected priorityClass(priority: string | undefined): string {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      default: return '';
    }
  }
}
