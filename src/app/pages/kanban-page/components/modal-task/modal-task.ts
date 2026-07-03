import { Component, inject, input, output } from '@angular/core';
import { Modal } from '../../../../shared/components/modal/modal';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { Button } from "../../../../shared/components/button/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-task',
  imports: [Modal, ModalFooter, Button, ReactiveFormsModule],
  templateUrl: './modal-task.html',
  styleUrl: './modal-task.css',
})
export class ModalTask {
  private fb = inject(FormBuilder);
  protected taskForm: FormGroup;
  public type = input<'edit' | 'create'>('create');
  public close = output();
  
  constructor() {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      due: ['']
    })
  }

  protected onSubmitForm() {
    if(this.taskForm.invalid)
      return;

    const {name} = this.taskForm.value;
    console.log(name);
    this.taskForm.reset();
    this.close.emit();
  }
}
