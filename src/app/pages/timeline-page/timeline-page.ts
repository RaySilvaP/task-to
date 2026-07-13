import { CdkDrag, CdkDragEnd, CdkDragMove, DragRef, Point } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-page',
  imports: [CdkDrag, CdkScrollable],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
})
export class TimelinePage {
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 1;
  @ViewChild('timeline') timeline!: ElementRef<HTMLDivElement>;
  protected block = signal<{ start: number, duration: number }>({
    start: 180,
    duration: 60
  });

  protected contrainPosition(userPointerPosition: Point, dragRef: DragRef, dimensions: DOMRect, pickupPositionInElement: Point): Point {
    console.log(pickupPositionInElement);
    const y = Math.round((userPointerPosition.y - pickupPositionInElement.y) / 15) * 15;
    return {
      x: 0,
      y
    };
  }

  protected onDragMove(event: CdkDragMove) {
    const container = this.timeline.nativeElement;

    const rect = container.getBoundingClientRect();
    const mouseY = event.pointerPosition.y;
    
    const threshold = 40;
    const speed = 10;

    if (mouseY < rect.top + threshold) {
        container.scrollTop -= speed;
    }

    if (mouseY > rect.bottom - threshold) {
        container.scrollTop += speed;
    }
  }

  protected onDragEnd(event: CdkDragEnd) {
    const timeLine = this.timeline.nativeElement.getBoundingClientRect();
    const block = event.source.element.nativeElement.getBoundingClientRect();
    console.log(block.top)

    const minutes = (block.top - timeLine.top) / this.pixelsPerMinute;

    const snapped = Math.round(minutes / 15) * 15;
    console.log(snapped)
    this.block.set({
      start: snapped,
      duration: this.block().duration
    })
  }

  protected calcPosition(startTime: number) {
    if (!this.timeline)
      return;

    const timelineTop = this.timeline.nativeElement.getBoundingClientRect().top;
    return startTime * this.pixelsPerMinute + timelineTop;
  }
}
