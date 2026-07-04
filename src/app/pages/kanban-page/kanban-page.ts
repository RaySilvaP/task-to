import { Component, signal } from '@angular/core';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { KanbanActionButton } from './components/kanban-action-button/kanban-action-button';
import { Modal } from "../../shared/components/modal/modal";
import { ModalFooter } from "../../shared/components/modal-footer/modal-footer";
import { Button } from "../../shared/components/button/button";
import { InputField } from "../../shared/components/input-field/input-field";

@Component({
  selector: 'app-kanban-page',
  imports: [KanbanBoard, KanbanActionButton, Modal, ModalFooter, Button, InputField],
  templateUrl: './kanban-page.html',
  styleUrl: './kanban-page.css',
})
export class KanbanPage {
  protected isModalOpen = signal<boolean>(false);
}
