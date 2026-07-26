import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Timeline } from "./components/timeline/timeline";
import { ModalTimeBlock } from "./components/modal-time-block/modal-time-block";
import { TaskService } from '../../services/task-service';
import { TimeBlockService } from '../../services/time-block-service';
import TimeBlock from '../../models/timeBlock';
import { TagService } from '../../services/tag-service';
import { StatisticsService } from '../../services/statistics-service';

@Component({
  selector: 'app-timeline-page',
  imports: [DatePipe, Timeline, ModalTimeBlock],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
  providers: [TaskService, TimeBlockService]
})
export class TimelinePage implements OnInit{
  private readonly timeBlockService = inject(TimeBlockService);
  private readonly tagService = inject(TagService);
  private readonly statisticsService = inject(StatisticsService);
  protected today = signal<Date>(new Date(Date.now()));
  protected showBlockModal = signal<boolean>(false);

  ngOnInit(): void {
    this.tagService.load();
    this.statisticsService.loadAverageBlockDuration();
  }

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
    this.statisticsService.loadAverageBlockDuration();
    this.showBlockModal.set(false);
  }
}
