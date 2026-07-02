import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-kanban-action-button',
  imports: [],
  templateUrl: './kanban-action-button.html',
  styleUrl: './kanban-action-button.css',
})
export class KanbanActionButton {
  protected isOpen = signal<boolean>(false);
}
