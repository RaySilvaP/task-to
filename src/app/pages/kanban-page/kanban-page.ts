import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { KanbanActionButton } from './components/kanban-action-button/kanban-action-button';
import { ContextService } from '../../services/context-service';
import { ModalContext } from "./components/modal-context/modal-context";
import Context from '../../models/context';
import { KanbanColumnService } from '../../services/kanban-column-service';
import { TaskService } from '../../services/task-service';
import { Button } from "../../shared/components/button/button";
import { ModalPrompt } from "../../shared/components/modal-prompt/modal-prompt";
import { Select } from "../../shared/components/select/select";
import { TagService } from '../../services/tag-service';

@Component({
  selector: 'app-kanban-page',
  imports: [KanbanBoard, KanbanActionButton, ModalContext, Button, ModalPrompt, Select, FormsModule],
  templateUrl: './kanban-page.html',
  styleUrl: './kanban-page.css',
  providers: [ContextService, KanbanColumnService, TaskService, TagService]
})
export class KanbanPage implements OnInit {
  protected readonly contextService = inject(ContextService);
  protected readonly kanbanColumnService = inject(KanbanColumnService);
  protected isModalOpen = signal<boolean>(false);
  protected showPromptModal = signal<number | null>(null);
  protected contexts = this.contextService.contexts;
  protected selectedContextId = this.contextService.getSelectedContext();

  protected selectedContext = computed(() => this.contexts().find(c => c.id === this.selectedContextId()));

  async ngOnInit(): Promise<void> {
    await this.contextService.load();
  }

  protected onSelectContext(value: string | number) {
    this.contextService.setSelectedContext(Number(value));
  }

  protected async onEditContext(context: Context) {
    await this.contextService.edit(context);
    this.isModalOpen.set(false);
  }

  protected async onDeleteContext(contextId: number) {
    const contextIndex = this.contexts().findIndex(c => c.id === contextId);

    await this.contextService.delete(contextId);
    this.isModalOpen.set(false);
    this.showPromptModal.set(null);

    if (this.contexts().length > 0 && contextIndex === this.contexts().length) {
      const previousContext = this.contexts().at(contextIndex - 1);
      this.contextService.setSelectedContext(previousContext?.id ?? null);
    }
    else if (this.contexts().length > 0) {
      const nextContext = this.contexts().at(contextIndex);
      this.contextService.setSelectedContext(nextContext?.id ?? null);
    }
    else {
      this.contextService.setSelectedContext(null);
    }
  }
}
