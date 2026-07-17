import { CdkDrag, CdkDragEnd, CdkDragHandle, DragRef, Point } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import TimeBlock from '../../models/timeBlock';
import { max } from 'rxjs';
import { Timeline } from "./components/timeline/timeline";

@Component({
  selector: 'app-timeline-page',
  imports: [CdkDrag, CdkDragHandle, DatePipe, Timeline],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.css',
})
export class TimelinePage {
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 0.75;
  protected today = signal<Date>(new Date(Date.now()));
  @ViewChild('timeline') timeline!: ElementRef<HTMLDivElement>;
  protected blocks = signal<TimeBlock[]>([
    { id: 0, name: 'Fazer alguma coisa', start: 900, duration: 60, overlapOrder: 1 },
    { id: 1, name: 'Fazer outra coisa', start: 120, duration: 60, overlapOrder: 1 },
    { id: 2, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 3, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 4, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 5, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 6, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 7, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 8, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
    { id: 9, name: 'Fazer muita coisa', start: 60, duration: 60, overlapOrder: 1 },
  ])
  protected blocksOverlapProps = signal<Map<number, { width: number, padding: number, order: number, blocksOverlapping: TimeBlock[] }>>(new Map())
  @ViewChild('resizeHandle') resizeHandle!: ElementRef<HTMLDivElement>;
  private resizeData: { startY: number; startDuration: number } | null = null;
  @ViewChild('timeBlockContainer') timeBlockContainer!: ElementRef<HTMLDivElement>;

  private startX = 0;
  private startY = 0;
  private isDraggingBlock = false;

  protected calcOverlap(block: TimeBlock) {
    const gap = 10;
    const containerWidth = this.timeBlockContainer.nativeElement.getBoundingClientRect().width;
    const blocksOverlapProps = this.blocksOverlapProps();
    const overlapProps = blocksOverlapProps.get(block.id);

    const blocksOverlapping = new Set(this.blocks()
      .filter(b => b.start < block.start + block.duration && block.start < b.start + b.duration));

    const blocks = this.blocks();
    let prevSize = 0;
    while (blocksOverlapping.size > prevSize) {
      prevSize = blocksOverlapping.size;
      for (const b of blocks) {
        if (blocksOverlapping.has(b)) continue;
        for (const ob of blocksOverlapping) {
          if (b.start < ob.start + ob.duration && ob.start < b.start + b.duration) {
            blocksOverlapping.add(b);
            break;
          }
        }
      }
    }

    if (overlapProps && overlapProps.blocksOverlapping.length > 0) {
      overlapProps.blocksOverlapping.forEach(blockOverlapping => {
        const blockOverlappingProps = blocksOverlapProps.get(blockOverlapping.id)!;
        blocksOverlapProps.set(blockOverlapping.id, {
          width: blockOverlappingProps?.width,
          padding: blockOverlappingProps?.padding,
          order: 1,
          blocksOverlapping: blockOverlappingProps?.blocksOverlapping.filter(b => b.id !== block.id)
        });
      });

      this.calcOverlap(overlapProps.blocksOverlapping[0]);
    }

    console.log(blocksOverlapping);
    if (blocksOverlapping.size > 1) {
      const blockWidth = containerWidth / blocksOverlapping.size - (gap * (blocksOverlapping.size - 1) / blocksOverlapping.size);

      const maxOrder = Math.max(
        ...Array.from(blocksOverlapping).map(b => blocksOverlapProps.get(b.id)?.order ?? 0),
        0
      );

      blocksOverlapProps.set(block.id, {
        width: containerWidth,
        padding: 0,
        order: maxOrder + 1,
        blocksOverlapping: []
      });

      Array.from(blocksOverlapping)
        .sort((b1, b2) => {
          const sortStart = b1.start - b2.start;
          const sortOrder = (blocksOverlapProps.get(b1.id)?.order ?? maxOrder + 1) - (blocksOverlapProps.get(b2.id)?.order ?? maxOrder + 1);
          return sortStart !== 0 ? sortStart : sortOrder;
        })
        .forEach((blockOverlapping, i) => {
          blocksOverlapProps.set(blockOverlapping.id, {
            width: blockWidth,
            padding: (blockWidth + gap) * i,
            order: i + 1,
            blocksOverlapping: Array.from(blocksOverlapping).filter(b => b.id !== blockOverlapping.id)
          })
        })
    }
    else {
      blocksOverlapProps.set(block.id, {
        width: containerWidth,
        padding: 0,
        order: 1,
        blocksOverlapping: []
      });

    }

    this.blocksOverlapProps.set(blocksOverlapProps);
  }

  protected getOverlapWidth(blockId: number) {
    const overlapProps = this.blocksOverlapProps().get(blockId);

    return overlapProps ? `${overlapProps.width}px` : '100%';
  }

  protected getOverlapPadding(blockId: number) {
    const overlapProps = this.blocksOverlapProps().get(blockId);

    return overlapProps ? `${overlapProps.padding}px` : '0';
  }

  protected resetDate() {
    this.today.set(new Date(Date.now()));
  }

  protected onPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    this.isDraggingBlock = !!target.closest('.cdk-drag');

    if (this.isDraggingBlock) {
      return;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  protected onPointerUp(event: PointerEvent) {
    if (this.isDraggingBlock)
      return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    const threshold = 50;

    if (
      Math.abs(deltaX) > threshold &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX > 0) {
        const date = new Date(this.today());
        date.setDate(date.getDate() - 1)
        this.today.set(date);
      } else {
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
      return { x: 0, y };
    }
  }

  protected onDragEnd(event: CdkDragEnd, block: TimeBlock) {
    const timeline = this.timeline.nativeElement.getBoundingClientRect();
    const blockElement = event.source.element.nativeElement.getBoundingClientRect();
    const grid = 15 * this.pixelsPerMinute;

    const snapped = Math.round((blockElement.top - timeline.top) / grid) * 15;
    block.start = snapped;
    this.calcOverlap(block);

    event.source.reset();
  }

  protected onResizePointerDown(event: PointerEvent, block: TimeBlock) {
    event.stopPropagation();
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    this.resizeData = {
      startY: event.clientY,
      startDuration: block.duration,
    };

    const onMove = (e: PointerEvent) => {
      if (!this.resizeData) return;
      const deltaY = e.clientY - this.resizeData.startY;
      const deltaMin = deltaY / this.pixelsPerMinute;
      const grid = 15;
      const newDuration = Math.round((this.resizeData.startDuration + deltaMin) / grid) * grid;
      block.duration = Math.max(grid, newDuration);
    };

    const onUp = (e: PointerEvent) => {
      this.resizeData = null;
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      this.calcOverlap(block);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  }
}
