import { CdkDrag, CdkDragEnd, DragRef, Point } from '@angular/cdk/drag-drop';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-page',
  imports: [CdkDrag],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
})
export class TimelinePage {
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 1;
  @ViewChild('timeline') timeline!: ElementRef<HTMLDivElement>;
  protected block = signal<{ start: number, duration: number }>({
    start: 900,
    duration: 60
  });

  protected contrainPosition(pixelsPerMinute: number): (
    userPointerPosition: Point,
    dragRef: DragRef,
    dimensions: DOMRect,
    pickupPositionInElement: Point)
    => Point {
    const grid = 15 * pixelsPerMinute;
    return (userPointerPosition: Point, dragRef: DragRef, dimensions: DOMRect, pickupPositionInElement: Point) => {
      const containerRect = this.timeline.nativeElement.getBoundingClientRect();
      const elementTop = userPointerPosition.y - pickupPositionInElement.y;
      const y = Math.round((elementTop - containerRect.top) / grid) * grid + containerRect.top;
      console.log(y)
      return { x: 0, y };
    }
  }

  protected onDragEnd(event: CdkDragEnd) {
    const timeline = this.timeline.nativeElement.getBoundingClientRect();
    const block = event.source.element.nativeElement.getBoundingClientRect();

    const snapped = Math.round((block.top - timeline.top) / 15) * 15;
    console.log(snapped)
    console.log(snapped + timeline.top)
    this.block.set({
      start: snapped,
      duration: this.block().duration
    })

    event.source.reset();
  }
}
