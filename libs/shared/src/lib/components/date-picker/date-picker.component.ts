import { Component, ChangeDetectionStrategy, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'lib-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  toolTipValue = input<string>('');
  hintText = input<string>('');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  onClassErrorInput = input<boolean>(false);
  appearance = input<'fill' | 'outline'>('outline');

  value = signal<Date | null>(null);
  isDisabled = signal<boolean>(false);

  // Callbacks opcionales para cumplir con el linter sin funciones vacías
  private onChange?: (value: Date | null) => void;
  private onTouched?: () => void;

  public writeValue(value: Date | null): void {
    this.value.set(value ?? null);
  }

  public registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const val = event.value ? new Date(event.value) : null;
    this.value.set(val);
    this.onChange?.(val);
    this.onTouched?.();
  }

  public onBlur(): void {
    this.onTouched?.();
  }
}
