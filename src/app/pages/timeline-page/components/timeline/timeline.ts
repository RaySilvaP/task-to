import { AfterViewInit, Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import TimeBlock from '../../../../models/timeBlock';
import { TimeBlockComponent } from "../time-block-component/time-block-component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, DragRef, Point } from '@angular/cdk/drag-drop';
import { ModalTimeBlock } from "../modal-time-block/modal-time-block";
import { TimeBlockService } from '../../../../services/time-block-service';

@Component({
  selector: 'app-timeline',
  imports: [TimeBlockComponent, CdkDrag, CdkDragHandle, ModalTimeBlock],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline {
  private readonly timeBlockService = inject(TimeBlockService);
  protected hours = Array.from({ length: 25 }, (_, i) => i);
  protected pixelsPerMinute = 1;
  protected today = new Date(Date.now());
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('timeBlocksContainer') timeBlocksContainer!: ElementRef<HTMLDivElement>;
  protected showTimeBlockModal = signal<TimeBlock | null>(null);
  protected isDragging = false;

  protected timeBlocks = this.timeBlockService.timeBlocks;

  protected resizeBlockData?: { startY: number, startDuration: number };
  protected blocksOverlapData = signal<Map<number, { width: number, padding: number, blocksOverlapping: TimeBlock[] }>>(new Map());
  public dateTime = input.required<Date>();

  constructor() {
    effect(async () => {
      await this.loadTimeBlocks();
    });

    effect(() => {
      this.blocksOverlapData.set(new Map(
        this.timeBlocks().map(block => {
          const blocksOverlapping = this.getBlocksOverlapping(block);

          const sameOrderBlocks = blocksOverlapping
            .filter(b => blocksOverlapping.some(b1 => b.overlap_order === b1.overlap_order && b.id !== b1.id));

          const newBlock = sameOrderBlocks.at(sameOrderBlocks.length - 1);
          if (newBlock) {
            this.checkBlockOverlap(newBlock);
          }

          return [block.id, this.calculateBlockOverlap(block, blocksOverlapping)]
        })
      ))
    })
  }

  protected async onEditTimeBlock(block: TimeBlock) {
    await this.timeBlockService.edit(block.id, block);
    this.showTimeBlockModal.set(null);
    await this.loadTimeBlocks();
  }

  protected async onDeleteBlock(blockId: number) {
    await this.timeBlockService.delete(blockId);

    const block = this.timeBlocks().find(b => b.id === blockId)!;
    const date = new Date(block.start_date_time);
    date.setDate(date.getDate() + 1);
    block.start_date_time = date.toISOString();

    this.propagateBlockOverlapCheck(block)

    this.showTimeBlockModal.set(null);
    this.loadTimeBlocks();
  }

  protected onBlockClick(block: TimeBlock) {
    if (this.isDragging) {
      this.isDragging = false;
      return;
    }

    this.showTimeBlockModal.set(block);
  }

  protected getStartMinutes(block: TimeBlock): number {
    const date = new Date(block.start_date_time);
    const minutes = date.getHours() * 60 + date.getMinutes();
    return minutes;
  }

  protected setStartMinutes(block: TimeBlock, minutes: number): void {
    const date = new Date(block.start_date_time);
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    block.start_date_time = date.toISOString();
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

  protected async onDragBlockEnded(event: CdkDragEnd, block: TimeBlock) {
    const containerRect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const blockElement = event.source.element.nativeElement.getBoundingClientRect();
    const grid = 15 * this.pixelsPerMinute;

    const newStart = Math.round((blockElement.top - containerRect.top) / grid) * 15;

    this.setStartMinutes(block, newStart);
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

    this.isDragging = true;
  }

  protected onResizeBlockPointerMove(event: PointerEvent, block: TimeBlock) {
    if (!this.resizeBlockData) return;
    const deltaY = event.clientY - this.resizeBlockData.startY;
    const deltaMin = deltaY / this.pixelsPerMinute;
    const grid = 15;
    const newDuration = Math.round((this.resizeBlockData.startDuration + deltaMin) / grid) * grid;
    block.duration = Math.max(grid, newDuration);
  }

  protected async onResizeBlockPointerUp(block: TimeBlock) {
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
    console.log(blocksOverlapping);

    this.propagateBlockOverlapCheck(block);

    if (blocksOverlapping.length > 1) {
      const maxOrder = Math.max(
        ...blocksOverlapping.map(b => b.overlap_order)
      );

      block.overlap_order = maxOrder + 1;

      blocksOverlapping
        .sort((b1, b2) => {
          const sortStart = this.getStartMinutes(b1) - this.getStartMinutes(b2);
          const sortOrder = b1.overlap_order - b2.overlap_order;
          return sortStart !== 0 ? sortStart : sortOrder;
        })
        .forEach((blockOverlapping, i) => {
          blockOverlapping.overlap_order = i + 1;
          blocksOverlapData.set(blockOverlapping.id, this.calculateBlockOverlap(blockOverlapping, blocksOverlapping))
          this.timeBlockService.edit(blockOverlapping.id, blockOverlapping);
        })
    }
    else {
      blocksOverlapData.set(block.id, this.calculateBlockOverlap(block, blocksOverlapping));
      block.overlap_order = 1;
      this.timeBlockService.edit(block.id, block);
    }

    this.blocksOverlapData.set(blocksOverlapData);
  }

  private propagateBlockOverlapCheck(block: TimeBlock) {
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
          const sortStart = this.getStartMinutes(b1) - this.getStartMinutes(b2);
          const sortOrder = b1.overlap_order - b2.overlap_order;
          return sortStart !== 0 ? sortStart : sortOrder;
        });

      this.checkBlockOverlap(blocksOverlappingSorted[blocksOverlappingSorted.length - 1]);
    }
  }

  private calculateBlockOverlap(block: TimeBlock, blocksOverlapping: TimeBlock[]) {
    const containerRect = this.timeBlocksContainer.nativeElement.getBoundingClientRect();

    if (blocksOverlapping.length > 1) {
      const gapPx = 10;
      const blockGapDiscountPx = gapPx * (blocksOverlapping.length - 1) / blocksOverlapping.length;
      const blockWidthPx = containerRect.width / blocksOverlapping.length - blockGapDiscountPx;

      return {
        width: blockWidthPx,
        padding: (blockWidthPx + gapPx) * (block.overlap_order - 1),
        blocksOverlapping: blocksOverlapping.filter(b => b.id != block.id)
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
      .filter(b => new Date(b.start_date_time).getDate() === new Date(block.start_date_time).getDate()
        && this.getStartMinutes(b) < this.getStartMinutes(block) + block.duration
        && this.getStartMinutes(block) < this.getStartMinutes(b) + b.duration));

    let prevSize = 0;
    while (blocksOverlapping.size > prevSize) {
      prevSize = blocksOverlapping.size;
      for (const b of blocks) {
        if (blocksOverlapping.has(b)) continue;
        for (const ob of blocksOverlapping) {
          if (new Date(b.start_date_time).getDate() === new Date(ob.start_date_time).getDate()
            && this.getStartMinutes(b) < this.getStartMinutes(ob) + ob.duration
            && this.getStartMinutes(ob) < this.getStartMinutes(b) + b.duration) {
            blocksOverlapping.add(b);
            break;
          }
        }
      }
    }

    return Array.from(blocksOverlapping);
  }

  private async loadTimeBlocks() {
    const date = new Date(this.dateTime().getFullYear(), this.dateTime().getMonth(), this.dateTime().getDate());
    await this.timeBlockService.loadByDay(date.toISOString());
  }
}
