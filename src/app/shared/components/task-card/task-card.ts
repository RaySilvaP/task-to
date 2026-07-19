import { Component, input } from '@angular/core';
import Task from '../../../models/task';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  public task = input.required<Task>();
}
