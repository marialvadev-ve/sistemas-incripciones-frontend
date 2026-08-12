import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ItemCardComponent } from '../item-card/item-card.component';

// Interfaz propia e independiente exclusiva para la lista de tarjetas
export interface CardFieldConfig<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  format?: (value: unknown, row: T) => string;
}

@Component({
  selector: 'lib-item-card-list-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ItemCardComponent],
  templateUrl: './item-card-list-layout.component.html',
  styleUrls: ['./item-card-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardListLayoutComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  @Input() title = '';
  @Input() fields: CardFieldConfig<T>[] = [];
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() currentPage = 1;
  @Input() isLoading = false; // Controla el estado de bloqueo y spinner del endpoint

  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() createAction = new EventEmitter<void>();
  @Output() editAction = new EventEmitter<T>();
  @Output() deleteAction = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();

  searchControl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchChange.emit(value);
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina > 0 && !this.isLoading) {
      this.pageChange.emit(pagina);
    }
  }
}
