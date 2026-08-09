import { Component, ChangeDetectionStrategy, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-input-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
})
export class InputNumberComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<string | number>('1');
  readonly = input<boolean>(false);
  toolTipValue = input<string>('');
  isRight = input<boolean>(false);
  onClassErrorInput = input<boolean>(false);
  hintText = input<string>('');

  value = signal<number | string | null>(null);
  isDisabled = signal<boolean>(false);

  // Callbacks opcionales para cumplir con el linter sin funciones vacías
  private onChange?: (value: number | null) => void;
  private onTouched?: () => void;

  public writeValue(value: number | string | null): void {
    this.value.set(value ?? null);
  }

  public registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const numericValue = inputValue === '' ? null : Number(inputValue);

    this.value.set(inputValue);
    this.onChange?.(numericValue);
    this.onTouched?.();
  }

  public onBlur(): void {
    this.onTouched?.();
  }
}
