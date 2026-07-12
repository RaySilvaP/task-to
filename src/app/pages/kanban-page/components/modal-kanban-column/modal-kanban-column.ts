import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import KanbanColumn from '../../../../models/kanban-column';
import { Modal } from "../../../../shared/components/modal/modal";
import { InputField } from "../../../../shared/components/input-field/input-field";
import { ModalFooter } from "../../../../shared/components/modal-footer/modal-footer";
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-modal-kanban-column',
  imports: [Modal, InputField, ModalFooter, Button, ReactiveFormsModule],
  templateUrl: './modal-kanban-column.html',
  styleUrl: './modal-kanban-column.css',
})
export class ModalKanbanColumn {
  private fb = inject(FormBuilder);
  protected kanbanColumnForm: FormGroup;
  public type = input<'edit' | 'create'>('create');
  public kanbanColumn = input<KanbanColumn>();
  public close = output();
  public submit = output<KanbanColumn>();
  public delete = output<number>();

  constructor() {
    this.kanbanColumnForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.kanbanColumnForm.patchValue(
      { name: this.kanbanColumn()?.name ?? '' },
      { emitEvent: false }
    )
  }

  protected onSubmitForm() {
    if (this.kanbanColumnForm.invalid)
      return;

    const { name } = this.kanbanColumnForm.value;
    this.kanbanColumnForm.reset();

    const kanbanColumn = {
      id: this.kanbanColumn()?.id ?? -1,
      name,
      position: this.kanbanColumn()?.position ?? -1,
      context_id: this.kanbanColumn()?.context_id ?? -1,
      tasks: this.kanbanColumn()?.tasks ?? []
    } as KanbanColumn

    this.submit.emit(kanbanColumn);
  }

  protected onDelete() {
    this.delete.emit(this.kanbanColumn()?.id ?? -1);
  }
}
