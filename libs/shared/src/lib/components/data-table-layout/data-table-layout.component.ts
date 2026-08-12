import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ItemCardComponent, TableColumn } from '../item-card/item-card.component';

@Component({
  selector: 'lib-data-table-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ItemCardComponent],
  templateUrl: './data-table-layout.component.html',
  styleUrls: ['./data-table-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableLayoutComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  @Input() title = '';
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() pageSize = 5;
  @Input() currentPage = 1;

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

  formatCell(col: TableColumn<T>, row: T): unknown {
    const value = row[col.key as string];
    if (col.format) {
      return col.format(value, row);
    }
    return value ?? '—';
  }

  onEdit(row: T, event: Event): void {
    event.stopPropagation();
    this.editAction.emit(row);
  }

  cambiarPagina(pagina: number): void {
    if (pagina > 0) {
      this.pageChange.emit(pagina);
    }
  }
}
