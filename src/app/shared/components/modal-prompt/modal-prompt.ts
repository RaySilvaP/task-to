import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';
import { ModalFooter } from '../modal-footer/modal-footer';

@Component({
  selector: 'app-modal-prompt',
  imports: [Modal, ModalFooter, Button],
  templateUrl: './modal-prompt.html',
  styleUrl: './modal-prompt.css',
})
export class ModalPrompt {
  title = input('Are you sure?');
  prompt = input.required<string>();
  cancelText = input('Cancel');
  confirmText = input('Confirm');
  confirm = output<void>();
  cancel = output<void>();
}
