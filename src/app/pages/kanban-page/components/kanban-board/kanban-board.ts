import { Component, signal } from '@angular/core';
import { KanbanTaskCard } from '../kanban-task-card/kanban-task-card';
import { Modal } from '../../../../shared/components/modal/modal';
import { Button } from '../../../../shared/components/button/button';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalTask } from "../modal-task/modal-task";

@Component({
  selector: 'app-kanban-board',
  imports: [KanbanTaskCard, Modal, Button, ModalFooter, ModalTask],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  protected isModalColumnOpen = signal<boolean>(false);
  protected isModalTaskOpen = signal<boolean>(false);

  protected onDeleteColumn() {
    this.isModalColumnOpen.set(false);
  }

  protected onSaveColumn() {
    this.isModalTaskOpen.set(false);
  }
}
