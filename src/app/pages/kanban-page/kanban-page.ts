import { Component } from '@angular/core';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { KanbanActionButton } from './components/kanban-action-button/kanban-action-button';

@Component({
  selector: 'app-kanban-page',
  imports: [KanbanBoard, KanbanActionButton],
  templateUrl: './kanban-page.html',
  styleUrl: './kanban-page.css',
})
export class KanbanPage {

}
