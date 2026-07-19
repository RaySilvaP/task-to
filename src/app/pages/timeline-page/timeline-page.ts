import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Timeline } from "./components/timeline/timeline";
import { ModalTimeBlock } from "./components/modal-time-block/modal-time-block";
import { TaskService } from '../../services/task-service';
import { TimeBlockService } from '../../services/time-block-service';

@Component({
  selector: 'app-timeline-page',
  imports: [DatePipe, Timeline, ModalTimeBlock],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
  providers: [TaskService, TimeBlockService]
})
export class TimelinePage {
  private swipeData = { startX: 0, startY: 0 };
  private isDraggingBlock = false;
  protected today = signal<Date>(new Date(Date.now()));
  protected showBlockModal = signal<boolean>(false);

  protected resetDate() {
    this.today.set(new Date(Date.now()));
  }

  protected onSwipePointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    this.isDraggingBlock = !!target.closest('.cdk-drag');

    if (this.isDraggingBlock) {
      return;
    }

    this.swipeData.startX = event.clientX;
    this.swipeData.startY = event.clientY;
  }

  protected onSwipePointerUp(event: PointerEvent) {
    if (this.isDraggingBlock)
      return;

    const deltaX = event.clientX - this.swipeData.startX;
    const deltaY = event.clientY - this.swipeData.startY;

    const threshold = 50;

    if (
      Math.abs(deltaX) > threshold &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX > 0) {
        this.increaseDate(-1);
      } else {
        this.increaseDate(1);
      }
    }
  }

  protected increaseDate(movement: number) {
    console.log("ffasd")
    const date = new Date(this.today());
    date.setDate(date.getDate() + movement)
    this.today.set(date);
  }
}
