import { Component, signal } from '@angular/core';
import { KanbanTaskCard } from '../kanban-task-card/kanban-task-card';
import { Modal } from '../../../../shared/components/modal/modal';
import { Button } from '../../../../shared/components/button/button';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalTask } from "../modal-task/modal-task";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  imports: [KanbanTaskCard, Modal, Button, ModalFooter, ModalTask, CdkDrag, CdkDropList],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  protected isModalColumnOpen = signal<boolean>(false);
  protected isModalTaskOpen = signal<boolean>(false);
  protected tasks = [
    'Task 1',
    'Task 2',
    'Task 3',
    'Task 4',
  ]

  protected tasks1 = [
    'Task 1',
    'Task 2',
    'Task 3',
    'Task 4',
  ]

  protected onDeleteColumn() {
    this.isModalColumnOpen.set(false);
  }

  protected onSaveColumn() {
    this.isModalTaskOpen.set(false);
  }

  protected drop(event: CdkDragDrop<string[]>) {
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
  }
}
