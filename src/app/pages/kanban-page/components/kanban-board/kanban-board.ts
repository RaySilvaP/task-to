import { Component, inject, OnInit, signal } from '@angular/core';
import { KanbanTaskCard } from '../kanban-task-card/kanban-task-card';
import { ModalTask } from "../modal-task/modal-task";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanColumnService } from '../../../../services/kanban-column-service';
import { ContextService } from '../../../../services/context-service';
import { ModalKanbanColumn } from "../modal-kanban-column/modal-kanban-column";
import KanbanColumn from '../../../../models/kanban-column';
import Task from '../../../../models/task';
import { TaskService } from '../../../../services/task-service';

@Component({
  selector: 'app-kanban-board',
  imports: [KanbanTaskCard, ModalTask, CdkDrag, CdkDropList, CdkDragHandle, CdkDropListGroup, ModalKanbanColumn],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoard implements OnInit {
  private kanbanColumnService = inject(KanbanColumnService);
  private contextService = inject(ContextService);
  private taskService = inject(TaskService);
  protected selectedContextId = this.contextService.getSelectedContext();
  protected modalKanbanColumnOpen = signal<KanbanColumn | null>(null);
  protected modalTaskOpen = signal<Task | null>(null);
  protected kanbanColumns = this.kanbanColumnService.kanban_columns;

  async ngOnInit(): Promise<void> {
    const selectedContextId = this.selectedContextId();
    if (selectedContextId !== null)
      await this.kanbanColumnService.load(selectedContextId);
  }

  protected async onDeleteColumn(kanbanColumnId: number) {
    const selectedContextId = this.selectedContextId();
    if (selectedContextId === null)
      return;

    await this.kanbanColumnService.delete(kanbanColumnId, selectedContextId);
    this.modalKanbanColumnOpen.set(null);
  }

  protected async onEditColumn(kanbanColumn: KanbanColumn) {
    await this.kanbanColumnService.edit(kanbanColumn);
    this.modalKanbanColumnOpen.set(null);
  }

  protected async onEditTask(task: Task) {
    const selectedContextId = this.selectedContextId();
    if (selectedContextId === null)
      return;

    await this.taskService.edit(task);
    this.modalTaskOpen.set(null);

    this.kanbanColumnService.load(selectedContextId);
  }

  protected async dropKanbanColumn(event: CdkDragDrop<KanbanColumn[]>) {
    const columns = this.kanbanColumns();
    const kanbanColumn1 = columns.at(event.previousIndex)!;
    const kanbanColumn2 = columns.at(event.currentIndex)!;

    moveItemInArray(columns, event.previousIndex, event.currentIndex);

    kanbanColumn1.position = event.currentIndex + 1;
    kanbanColumn2.position = event.previousIndex + 1;

    await this.kanbanColumnService.edit(kanbanColumn1);
    await this.kanbanColumnService.edit(kanbanColumn2);
  }

  protected async dropTask(event: CdkDragDrop<Task[]>) {
    const task1 = event.previousContainer.data.at(event.previousIndex)!;
    const task2 = event.container.data.at(event.currentIndex)!;
    console.log(task1);
    console.log(task2);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    return;
    task1.position = event.currentIndex + 1;
    task2.position = event.previousIndex + 1;

    await this.taskService.edit(task1);
    await this.taskService.edit(task2);
    await this.kanbanColumnService.load(this.selectedContextId()!);
  }
}
