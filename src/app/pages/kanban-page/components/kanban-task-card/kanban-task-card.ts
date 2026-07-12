import { Component, input } from '@angular/core';
import Task from '../../../../models/task';

@Component({
  selector: 'app-kanban-task-card',
  imports: [],
  templateUrl: './kanban-task-card.html',
  styleUrl: './kanban-task-card.css',
})
export class KanbanTaskCard {
  public task = input.required<Task>();
}
