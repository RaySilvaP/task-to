import { Component, signal } from '@angular/core';
import { KanbanTaskCard } from '../kanban-task-card/kanban-task-card';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-kanban-board',
  imports: [KanbanTaskCard, Modal],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  protected isModalOpen = signal<boolean>(false);
}
