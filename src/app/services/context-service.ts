import { Injectable, signal } from '@angular/core';
import Context from '../models/context';
import { invoke } from '@tauri-apps/api/core';

const SELECTED_CONTEXT_KEY = 'selected_context_id';

@Injectable()
export class ContextService {
  private readonly selectedContext = signal<number | null>(null);
  private readonly _contexts = signal<Context[]>([]);
  public readonly contexts = this._contexts.asReadonly();

  public getSelectedContext() {
    if (this.selectedContext() === null) {
      const storedContext = localStorage.getItem(SELECTED_CONTEXT_KEY);
      if (storedContext !== null)
        this.selectedContext.set(JSON.parse(storedContext));
    }

    return this.selectedContext;
  }

  public setSelectedContext(contextId: number | null) {
    this.selectedContext.set(contextId);
    localStorage.setItem(SELECTED_CONTEXT_KEY, JSON.stringify(contextId));
  }

  public async load(): Promise<void> {
    const contexts = await invoke<Context[]>('get_contexts');
    this._contexts.set(contexts);
  }

  public async add(name: string) {
    await invoke('add_context', { context: { name } });
    await this.load();
  }

  public async edit(context: Context) {
    await invoke('edit_context', { contextId: context.id, context });
    await this.load();
  }

  public async delete(id: number) {
    await invoke('delete_context', {contextId: id});
    await this.load();
  }
}
