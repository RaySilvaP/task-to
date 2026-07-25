import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Timeline } from "./components/timeline/timeline";
import { ModalTimeBlock } from "./components/modal-time-block/modal-time-block";
import { TaskService } from '../../services/task-service';
import { TimeBlockService } from '../../services/time-block-service';
import TimeBlock from '../../models/timeBlock';

@Component({
  selector: 'app-timeline-page',
  imports: [DatePipe, Timeline, ModalTimeBlock],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
  providers: [TaskService, TimeBlockService]
})
export class TimelinePage {
  private readonly timeBlockService = inject(TimeBlockService);
  protected today = signal<Date>(new Date(Date.now()));
  protected showBlockModal = signal<boolean>(false);

  protected resetDate() {
    this.today.set(new Date(Date.now()));
  }

  protected increaseDate(movement: number) {
    console.log("ffasd")
    const date = new Date(this.today());
    date.setDate(date.getDate() + movement)
    this.today.set(date);
  }

  protected onCreateTimeBlock(block: TimeBlock) {
    this.timeBlockService.add(block);
    this.timeBlockService.loadByLastDay();
    this.showBlockModal.set(false);
  }
}
