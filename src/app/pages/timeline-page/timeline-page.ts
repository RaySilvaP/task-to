import { CdkDrag, CdkDragEnd, CdkDragHandle, DragRef, Point } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-page',
  imports: [CdkDrag, CdkDragHandle, DatePipe],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
})
export class TimelinePage {
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 0.75;
  protected today = signal<Date>(new Date(Date.now()));
  @ViewChild('timeline') timeline!: ElementRef<HTMLDivElement>;
  protected block = signal<{ start: number, duration: number }>({
    start: 900,
    duration: 60
  });
  @ViewChild('resizeHandle') resizeHandle!: ElementRef<HTMLDivElement>;
  private resizeData: { startY: number; startDuration: number } | null = null;

  private startX = 0;
  private startY = 0;
  private isDraggingBlock = false;

  protected resetDate() {
    this.today.set(new Date(Date.now()));
  }

  protected onPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    this.isDraggingBlock = !!target.closest('.cdk-drag');

    if (this.isDraggingBlock) {
      return;
    }

    console.log("pointer down");
    console.log(`${event.clientX} - ${event.clientY}`);

    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  protected onPointerUp(event: PointerEvent) {
    if(this.isDraggingBlock)
      return;

    console.log("pointer up")
    console.log(`${event.clientX} - ${event.clientY}`)
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    const threshold = 50;

    if (
      Math.abs(deltaX) > threshold &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX > 0) {
        console.log('Swipe right');
        const date = new Date(this.today());
        date.setDate(date.getDate() - 1)
        this.today.set(date);
      } else {
        console.log('Swipe left');
        const date = new Date(this.today());
        date.setDate(date.getDate() + 1)
        this.today.set(date);
      }
    }
  }

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
    const grid = 15 * this.pixelsPerMinute;

    const snapped = Math.round((block.top - timeline.top) / grid) * 15;
    this.block.set({
      start: snapped,
      duration: this.block().duration
    })

    event.source.reset();
  }

  protected onResizePointerDown(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    this.resizeData = {
      startY: event.clientY,
      startDuration: this.block().duration,
    };

    const onMove = (e: PointerEvent) => {
      if (!this.resizeData) return;
      const deltaY = e.clientY - this.resizeData.startY;
      const deltaMin = deltaY / this.pixelsPerMinute;
      const grid = 15;
      const newDuration = Math.round((this.resizeData.startDuration + deltaMin) / grid) * grid;
      this.block.set({
        start: this.block().start,
        duration: Math.max(grid, newDuration),
      });
    };

    const onUp = (e: PointerEvent) => {
      this.resizeData = null;
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  }
}
