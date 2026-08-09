import { Component, ChangeDetectionStrategy, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  readonly = input<boolean>(false);

  value = signal<string>('');
  isDisabled = signal<boolean>(false);

  // Callbacks requeridos por ControlValueAccessor
  // Callbacks opcionales para satisfacer el linter sin funciones vacías
  private onChange?: (value: string) => void;
  protected onTouched?: () => void;

  public onBlur(): void {
    this.onTouched?.();
  }

  public writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange?.(val); // Usamos ?. para invocar de forma segura si ya está registrado
    this.onTouched?.();
  }
}
