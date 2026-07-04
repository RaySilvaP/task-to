import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true,
    }
  ]
})
export class InputField implements ControlValueAccessor{
  private onChange = (_: string) => {};
  private onTouched = () => {};

  protected value = '';
  protected disabled = false;

  public label = input<string>('');
  public placeholder = input<string>('');
  public type = input<'text' | 'date'>('text');
  public change = output<string>();

  public writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.change.emit(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
