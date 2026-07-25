import { Component, effect, inject, signal } from '@angular/core';
import { ModalTask } from "../modal-task/modal-task";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanColumnService } from '../../../../services/kanban-column-service';
import { ContextService } from '../../../../services/context-service';
import { ModalKanbanColumn } from "../modal-kanban-column/modal-kanban-column";
import KanbanColumn from '../../../../models/kanban-column';
import Task from '../../../../models/task';
import { TaskService } from '../../../../services/task-service';
import { TaskCard } from '../../../../shared/components/task-card/task-card';
import { ModalPrompt } from "../../../../shared/components/modal-prompt/modal-prompt";

@Component({
  selector: 'app-kanban-board',
  imports: [ModalTask, CdkDrag, CdkDropList, CdkDragHandle, CdkDropListGroup, ModalKanbanColumn, TaskCard, ModalPrompt],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoard {
  private kanbanColumnService = inject(KanbanColumnService);
  private contextService = inject(ContextService);
  private taskService = inject(TaskService);
  protected selectedContextId = this.contextService.getSelectedContext();
  protected modalKanbanColumnOpen = signal<KanbanColumn | null>(null);
  protected modalTaskOpen = signal<Task | null>(null);
  protected showTaskPromptModal = signal<number | null>(null);
  protected showColumnPromptModal = signal<number | null>(null);
  protected kanbanColumns = this.kanbanColumnService.kanban_columns;

  constructor() {
    effect(async () => {
      const selectedContextId = this.selectedContextId();
      await this.kanbanColumnService.load(selectedContextId);
    })
  }

  protected async onDeleteColumn(kanbanColumnId: number) {
    const selectedContextId = this.selectedContextId();
    if (selectedContextId === null)
      return;

    await this.kanbanColumnService.delete(kanbanColumnId, selectedContextId);
    this.modalKanbanColumnOpen.set(null);
    this.showColumnPromptModal.set(null);
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

  protected async onDeleteTask(taskId: number) {
    await this.taskService.delete(taskId);
    this.kanbanColumnService.load(this.selectedContextId()!);
    this.modalTaskOpen.set(null);
    this.showTaskPromptModal.set(null);
  }

  protected async dropKanbanColumn(event: CdkDragDrop<KanbanColumn[]>) {
    const columns = this.kanbanColumns();
    const kanbanColumn1 = columns.at(event.previousIndex)!;
    const kanbanColumn2 = columns.at(event.currentIndex)!;

    moveItemInArray(columns, event.previousIndex, event.currentIndex);

    kanbanColumn1.position = event.currentIndex + 1;
    kanbanColumn2.position = event.previousIndex + 1;

    this.kanbanColumnService.order(this.selectedContextId()!, [kanbanColumn1, kanbanColumn2]);
  }

  protected async dropTask(event: CdkDragDrop<Task[]>, kanbanColumnId: number) {
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

    const task = event.container.data.at(event.currentIndex)!;
    const previousOrdered = this.orderTasks(event.previousContainer.data);
    const currentOrdered = this.orderTasks(event.container.data);

    const previousColumnId = task.kanban_column_id;
    task.kanban_column_id = kanbanColumnId;

    this.taskService.edit(task);
    this.taskService.order(previousColumnId, previousOrdered);
    this.taskService.order(kanbanColumnId, currentOrdered);
  }

  private orderTasks(tasks: Task[]): Task[] {
    return tasks.map((task, index) => {
      task.position = index + 1;
      return task;
    });
  }
}
