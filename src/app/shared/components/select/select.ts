import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    }
  ]
})
export class Select implements ControlValueAccessor {
  private onChange = (_: string) => { };
  private onTouched = () => { };

  protected _value = '';
  protected _disabled = false;

  label = input('');
  placeholder = input('Select an option');
  disabled = input(false);
  valueChange = output<string>();

  get _combinedDisabled(): boolean {
    return this._disabled || this.disabled();
  }

  public writeValue(value: string | null): void {
    this._value = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
  }

  protected onChangeEvent(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this._value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
