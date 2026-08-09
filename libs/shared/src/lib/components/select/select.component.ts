import { Component, ChangeDetectionStrategy, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SelectOption {
  label: string;
  value: unknown;
}

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);

  value = signal<unknown>(null);
  isDisabled = signal<boolean>(false);

  private onChange?: (value: unknown) => void;
  protected onTouched?: () => void;

  public onBlur(): void {
    this.onTouched?.();
  }

  public writeValue(value: unknown): void {
    this.value.set(value);
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onSelectionChange(event: MatSelectChange): void {
    const val = event.value;
    this.value.set(val);
    this.onChange?.(val); // Invocación segura
    this.onTouched?.();
  }
}
