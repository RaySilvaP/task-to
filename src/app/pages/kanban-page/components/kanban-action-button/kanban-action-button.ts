import { Component, signal } from '@angular/core';
import { ModalTask } from "../modal-task/modal-task";
import { Modal } from "../../../../shared/components/modal/modal";
import { ModalFooter } from "../../../../shared/components/modal-footer/modal-footer";
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-kanban-action-button',
  imports: [ModalTask, Modal, ModalFooter, Button],
  templateUrl: './kanban-action-button.html',
  styleUrl: './kanban-action-button.css',
})
export class KanbanActionButton {
  protected isOpen = signal<boolean>(false);
  protected isModalOpen = signal<'none' | 'task' | 'context' | 'column'>('none');
}
