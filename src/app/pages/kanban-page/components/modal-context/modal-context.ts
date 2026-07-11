import { Component, inject, input, OnInit, output } from '@angular/core';
import { Modal } from "../../../../shared/components/modal/modal";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputField } from "../../../../shared/components/input-field/input-field";
import { ModalFooter } from "../../../../shared/components/modal-footer/modal-footer";
import { Button } from "../../../../shared/components/button/button";
import Context from '../../../../models/context';

@Component({
  selector: 'app-modal-context',
  imports: [Modal, ReactiveFormsModule, InputField, ModalFooter, Button],
  templateUrl: './modal-context.html',
  styleUrl: './modal-context.css',
})
export class ModalContext implements OnInit {
  private fb = inject(FormBuilder);
  protected contextForm: FormGroup;
  public type = input<'edit' | 'create'>('create');
  public context = input<Context>();
  public close = output();
  public submit = output<Context>();
  public delete = output<number>();

  constructor() {
    this.contextForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.contextForm.patchValue(
      { name: this.context()?.name ?? '' },
      { emitEvent: false }
    )
  }

  protected onSubmitForm() {
    if (this.contextForm.invalid)
      return;

    const { name } = this.contextForm.value;

    this.contextForm.reset();

    this.submit.emit({ id: this.context()?.id ?? -1, name });
  }

  protected onDelete() {
    this.delete.emit(this.context()?.id ?? -1);
  }
}
