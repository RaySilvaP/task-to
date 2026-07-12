import { Injectable, signal } from '@angular/core';
import KanbanColumn from '../models/kanban-column';
import { invoke } from '@tauri-apps/api/core';

@Injectable()
export class KanbanColumnService {
  private readonly _kanban_columns = signal<KanbanColumn[]>([]);
  public readonly kanban_columns = this._kanban_columns.asReadonly();

  public async load(contextId: number) {
    const columns = await invoke<KanbanColumn[]>('get_kanban_columns', { contextId });
    this._kanban_columns.set(columns);
  }

  public async add(kanbanColumn: KanbanColumn) {
    await invoke('add_kanban_column', { kanbanColumn });
    await this.load(kanbanColumn.context_id);
  }

  public async edit(kanbanColumn: KanbanColumn) {
    await invoke('edit_kanban_column', { kanbanColumnId: kanbanColumn.id, kanbanColumn });
    await this.load(kanbanColumn.context_id);
  }

  public async delete(kanbanColumnId: number, contextId: number) {
    await invoke('delete_kanban_column', { kanbanColumnId });
    await this.load(contextId);
  }
}
