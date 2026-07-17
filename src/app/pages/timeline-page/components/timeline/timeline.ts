import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import TimeBlock from '../../../../models/timeBlock';
import { TimeBlockComponent } from "../time-block-component/time-block-component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, DragRef, Point } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-timeline',
  imports: [TimeBlockComponent, CdkDrag, CdkDragHandle],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline implements AfterViewInit {
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 0.75;
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('timeBlocksContainer') timeBlocksContainer!: ElementRef<HTMLDivElement>;

  protected timeBlocks = signal<TimeBlock[]>([
    { id: 0, name: 'Fazer alguma coisa', start: 900, duration: 60, overlapOrder: 1 },
    { id: 1, name: 'Fazer outra coisa', start: 300, duration: 60, overlapOrder: 1 },
    { id: 2, name: 'Fazer mais coisa', start: 500, duration: 60, overlapOrder: 1 },
    { id: 3, name: 'Fazer nenhuma coisa', start: 600, duration: 60, overlapOrder: 1 },
    { id: 4, name: 'Fazer qualquer coisa', start: 600, duration: 60, overlapOrder: 2 },
    { id: 5, name: 'Fazer muita coisa', start: 600, duration: 60, overlapOrder: 3 },
  ]);
  protected resizeBlockData?: { startY: number, startDuration: number };
  protected blocksOverlapData = signal<Map<number, { width: number, padding: number, blocksOverlapping: TimeBlock[] }>>(new Map());

  ngAfterViewInit(): void {
    this.blocksOverlapData.set(new Map(
      this.timeBlocks().map(b => {
        const blocksOverlapping = this.getBlocksOverlapping(b);
        return [b.id, this.calculateBlockOverlap(b, blocksOverlapping)]
      })
    ))
    this.timeBlocks().forEach(b => {
    })
  }

  protected contrainBlockPosition(pixelsPerMinute: number) {
    return (
      userPointerPosition: Point,
      dragRef: DragRef,
      dimensions: DOMRect,
      pickupPositionInElement: Point
    ) => {
      const grid = 15 * pixelsPerMinute;
      const containerRect = this.timelineContainer.nativeElement.getBoundingClientRect();
      const elementTop = userPointerPosition.y - pickupPositionInElement.y;

      const y = Math.round((elementTop - containerRect.top) / grid) * grid + containerRect.top;
      return { x: 0, y };
    }
  }

  protected onDragBlockEnded(event: CdkDragEnd, block: TimeBlock) {
    const containerRect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const blockElement = event.source.element.nativeElement.getBoundingClientRect();
    const grid = 15 * this.pixelsPerMinute;

    const newStart = Math.round((blockElement.top - containerRect.top) / grid) * 15;
    block.start = newStart;

    this.checkBlockOverlap(block);
    event.source.reset();
  }

  protected onResizeBlockPointerDown(event: PointerEvent, block: TimeBlock) {
    event.stopPropagation();
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    this.resizeBlockData = {
      startY: event.clientY,
      startDuration: block.duration,
    };
  }

  protected onResizeBlockPointerMove(event: PointerEvent, block: TimeBlock) {
    if (!this.resizeBlockData) return;
    const deltaY = event.clientY - this.resizeBlockData.startY;
    const deltaMin = deltaY / this.pixelsPerMinute;
    const grid = 15;
    const newDuration = Math.round((this.resizeBlockData.startDuration + deltaMin) / grid) * grid;
    block.duration = Math.max(grid, newDuration);
  }

  protected onResizeBlockPointerUp(block: TimeBlock) {
    this.resizeBlockData = undefined;
    this.checkBlockOverlap(block);
  }

  protected getBlockOverlapWidth(blockId: number) {
    const overlapProps = this.blocksOverlapData().get(blockId);

    return overlapProps ? `${overlapProps.width}px` : '100%';
  }

  protected getBlockOverlapPadding(blockId: number) {
    const overlapProps = this.blocksOverlapData().get(blockId);

    return overlapProps ? `${overlapProps.padding}px` : '0';
  }

  private checkBlockOverlap(block: TimeBlock) {
    const blocksOverlapData = this.blocksOverlapData();
    const blocksOverlapping = this.getBlocksOverlapping(block);
    console.log(blocksOverlapData)

    this.propagateBlockOverlapCheck(block);

    if (blocksOverlapping.size > 1) {
      const maxOrder = Math.max(
        ...Array.from(blocksOverlapping).map(b => b.overlapOrder)
      );

      block.overlapOrder = maxOrder + 1;


      Array.from(blocksOverlapping)
        .sort((b1, b2) => {
          const sortStart = b1.start - b2.start;
          const sortOrder = b1.overlapOrder - b2.overlapOrder;
          return sortStart !== 0 ? sortStart : sortOrder;
        })
        .forEach((blockOverlapping, i) => {
          blockOverlapping.overlapOrder = i + 1;
          blocksOverlapData.set(blockOverlapping.id, this.calculateBlockOverlap(blockOverlapping, blocksOverlapping))
        })
    }
    else {
      blocksOverlapData.set(block.id, this.calculateBlockOverlap(block, blocksOverlapping));
      block.overlapOrder = 1;
    }

    this.blocksOverlapData.set(blocksOverlapData);
  }

  private propagateBlockOverlapCheck(block: TimeBlock) {
    console.log(block);
    const blocksOverlapData = this.blocksOverlapData();
    const blockOverlapData = blocksOverlapData.get(block.id);

    if (blockOverlapData && blockOverlapData.blocksOverlapping.length > 0) {
      blockOverlapData.blocksOverlapping.forEach(blockOverlapping => {
        const blockOverlappingProps = blocksOverlapData.get(blockOverlapping.id)!;
        blocksOverlapData.set(blockOverlapping.id, {
          width: blockOverlappingProps?.width,
          padding: blockOverlappingProps?.padding,
          blocksOverlapping: blockOverlappingProps?.blocksOverlapping.filter(b => b.id !== block.id)
        });
      });

      const blocksOverlappingSorted = blockOverlapData.blocksOverlapping
        .sort((b1, b2) => {
          const sortStart = b1.start - b2.start;
          const sortOrder = b1.overlapOrder - b2.overlapOrder;
          return sortStart !== 0 ? sortStart : sortOrder;
        });

      this.checkBlockOverlap(blocksOverlappingSorted[blocksOverlappingSorted.length - 1]);
    }
  }

  private calculateBlockOverlap(block: TimeBlock, blocksOverlapping: Set<TimeBlock>) {
    const containerRect = this.timeBlocksContainer.nativeElement.getBoundingClientRect();

    if (blocksOverlapping.size > 1) {
      const gapPx = 10;
      const blockGapDiscountPx = gapPx * (blocksOverlapping.size - 1) / blocksOverlapping.size;
      const blockWidthPx = containerRect.width / blocksOverlapping.size - blockGapDiscountPx;

      return {
        width: blockWidthPx,
        padding: (blockWidthPx + gapPx) * (block.overlapOrder - 1),
        blocksOverlapping: Array.from(blocksOverlapping).filter(b => b.id != block.id)
      };
    }
    else {
      return {
        width: containerRect.width,
        padding: 0,
        blocksOverlapping: []
      };
    }
  }

  private getBlocksOverlapping(block: TimeBlock) {
    const blocks = this.timeBlocks();
    const blocksOverlapping = new Set(blocks
      .filter(b => b.start < block.start + block.duration && block.start < b.start + b.duration));

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

    return blocksOverlapping;
  }
}
