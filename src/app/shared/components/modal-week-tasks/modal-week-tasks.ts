import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Modal } from "../modal/modal";
import { TaskCard } from "../task-card/task-card";
import Task from '../../../models/task';
import { StatisticsService } from '../../../services/statistics-service';

@Component({
  selector: 'app-modal-week-tasks',
  imports: [Modal, TaskCard],
  templateUrl: './modal-week-tasks.html',
  styleUrl: './modal-week-tasks.css',
})
export class ModalWeekTasks implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  protected weekTasks = signal<Task[]>([]);
  public close = output();

  async ngOnInit(): Promise<void> {
    const tasks = await this.statisticsService.getWeekTasks();
    this.weekTasks.set(tasks);
  }
}
