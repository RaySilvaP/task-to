import { Component, inject, signal } from '@angular/core';
import { ModalTask } from "../modal-task/modal-task";
import { Modal } from "../../../../shared/components/modal/modal";
import { ModalFooter } from "../../../../shared/components/modal-footer/modal-footer";
import { Button } from "../../../../shared/components/button/button";
import { ModalContext } from "../modal-context/modal-context";
import { ContextService } from '../../../../services/context-service';
import Context from '../../../../models/context';

@Component({
  selector: 'app-kanban-action-button',
  imports: [ModalTask, Modal, ModalFooter, Button, ModalContext],
  templateUrl: './kanban-action-button.html',
  styleUrl: './kanban-action-button.css',
})
export class KanbanActionButton {
  private contextService = inject(ContextService);
  protected isOpen = signal<boolean>(false);
  protected isModalOpen = signal<'none' | 'task' | 'context' | 'column'>('none');

  protected async onCreateContext(context: Context) {
    await this.contextService.add(context.name);
  }
}
