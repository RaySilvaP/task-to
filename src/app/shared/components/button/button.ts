import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
}
