import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ModalTask } from "../modal-task/modal-task";
import { ModalContext } from "../modal-context/modal-context";
import { ContextService } from '../../../../services/context-service';
import Context from '../../../../models/context';
import { ModalKanbanColumn } from "../modal-kanban-column/modal-kanban-column";
import KanbanColumn from '../../../../models/kanban-column';
import { KanbanColumnService } from '../../../../services/kanban-column-service';
import Task from '../../../../models/task';
import { TaskService } from '../../../../services/task-service';

@Component({
  selector: 'app-kanban-action-button',
  imports: [ModalTask, ModalContext, ModalKanbanColumn],
  templateUrl: './kanban-action-button.html',
  styleUrl: './kanban-action-button.css',
})
export class KanbanActionButton {
  private contextService = inject(ContextService);
  private kanbanColumnService = inject(KanbanColumnService);
  private taskService = inject(TaskService);
  private elementRef = inject(ElementRef);
  protected selectedContextId = this.contextService.getSelectedContext();
  protected isOpen = signal<boolean>(false);
  protected isModalOpen = signal<'none' | 'task' | 'context' | 'column'>('none');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  protected async onCreateTask(task: Task) {
    const selectedContextId = this.selectedContextId();
    const columns = this.kanbanColumnService.kanban_columns();
    if(columns.length === 0 || selectedContextId === null)
      return;

    const firstColumn = columns.at(0)!;

    task.kanban_column_id = firstColumn.id;
    task.position = firstColumn.tasks.length > 0 
      ? firstColumn.tasks.at(firstColumn.tasks.length - 1)!.position
      : 1;

    await this.taskService.add(task);
    this.kanbanColumnService.load(selectedContextId);
    this.isModalOpen.set('none');
    this.isOpen.set(false);
  }

  protected async onCreateContext(context: Context) {
    await this.contextService.add(context.name);
    this.isModalOpen.set('none');
    this.isOpen.set(false);
  }

  protected async onCreateKanbanColumn(kanbanColumn: KanbanColumn) {
    const selectedContextId = this.selectedContextId();
    if (selectedContextId === null)
      return;

    const columns = this.kanbanColumnService.kanban_columns();
    kanbanColumn.context_id = selectedContextId;
    kanbanColumn.position = (columns.at(columns.length - 1)?.position ?? 0) + 1;

    await this.kanbanColumnService.add(kanbanColumn);
    this.isModalOpen.set('none');
    this.isOpen.set(false);
  }
}
