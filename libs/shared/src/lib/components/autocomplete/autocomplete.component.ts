import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription, Observable, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';

export interface AutocompleteOption {
  id: string | number;
  nombre: string;
  [key: string]: unknown;
}

@Component({
  selector: 'lib-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
  label = input<string>('');
  placeholder = input<string>('');
  toolTipValue = input<string>('');
  showAddButton = input<boolean>(false);
  showEditButton = input<boolean>(false);

  // Función provista externamente tipada de forma estricta con Observable y sin 'any'
  searchService = input.required<(query: string) => Observable<unknown>>();

  // Eventos hacia arriba (sin prefijo "on" para cumplir con el linter de Angular)
  itemSelected = output<AutocompleteOption | null>();
  addNew = output<void>();
  editItem = output<AutocompleteOption>();

  searchControl = new FormControl('');
  options = signal<AutocompleteOption[]>([]);
  isLoading = signal<boolean>(false);
  selectedItem = signal<AutocompleteOption | null>(null);
  isDisabled = signal<boolean>(false);

  private sub = new Subscription();

  // Callbacks opcionales para cumplir con el linter corporativo sin funciones vacías
  private onChange?: (value: unknown) => void;
  private onTouched?: () => void;

  public ngOnInit(): void {
    this.sub.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(400), // Evita saturar la red ante mecanografía rápida
          distinctUntilChanged(),
          filter((text): text is string => typeof text === 'string'),
          tap(() => this.isLoading.set(true)),
          switchMap((query) => {
            const fn = this.searchService();
            if (!fn) return [];
            return fn(query);
          }),
        )
        .subscribe({
          next: (response: unknown) => {
            this.isLoading.set(false);

            let list: AutocompleteOption[] = [];

            // Procesamiento seguro de la respuesta tipada como unknown
            if (response && typeof response === 'object') {
              const resObj = response as Record<string, unknown>;
              const data = resObj['data'];

              if (data && typeof data === 'object') {
                if (Array.isArray(data)) {
                  list = data as AutocompleteOption[];
                } else {
                  const dataObj = data as Record<string, unknown>;
                  if (Array.isArray(dataObj['items'])) {
                    list = dataObj['items'] as AutocompleteOption[];
                  }
                }
              } else if (Array.isArray(response)) {
                list = response as AutocompleteOption[];
              }
            }

            this.options.set(list);
          },
          error: () => {
            this.isLoading.set(false);
            this.options.set([]);
          },
        }),
    );
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public writeValue(value: unknown): void {
    if (value && typeof value === 'object' && 'nombre' in value) {
      const item = value as AutocompleteOption;
      this.selectedItem.set(item);
      this.searchControl.setValue(item.nombre || '', { emitEvent: false });
    } else {
      this.selectedItem.set(null);
      this.searchControl.setValue('', { emitEvent: false });
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  public displayFn(item: AutocompleteOption): string {
    return item && item.nombre ? item.nombre : '';
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const item: AutocompleteOption = event.option.value;
    this.selectedItem.set(item);
    this.onChange?.(item);
    this.onTouched?.();
    this.itemSelected.emit(item);
  }

  public clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedItem.set(null);
    this.searchControl.setValue('');
    this.onChange?.(null);
    this.onTouched?.();
    this.itemSelected.emit(null);
  }

  public onInputKeyup(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (!val) {
      this.clearSelection(event as unknown as MouseEvent);
    }
  }
}
