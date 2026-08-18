import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ItemCardComponent, TableColumn } from '../item-card/item-card.component';
import { Identifiable } from '../../models/identifiable/identifiable.model';

@Component({
  selector: 'lib-data-table-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ItemCardComponent], // <-- AQUÍ SE AGREGA EL COMPONENTE
  templateUrl: './data-table-layout.component.html',
  styleUrls: ['./data-table-layout.component.scss'],
})
export class DataTableLayoutComponent<T extends Identifiable> implements OnInit, OnDestroy {
  @Input({ required: true }) title = '';
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: TableColumn<T>[] = [];
  @Input() totalRecords = 0;
  @Input() currentPage = 1;

  @Output() createAction = new EventEmitter<void>();
  @Output() editAction = new EventEmitter<T>();
  @Output() deleteAction = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => {
      this.searchChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatCell(col: TableColumn<T>, row: T): unknown {
    const record = row as unknown as Record<string, unknown>;
    const value = record[String(col.key)];
    if (col.format) {
      return col.format(value, row);
    }
    return value ?? '';
  }

  onEdit(row: T, event: Event): void {
    event.stopPropagation();
    this.editAction.emit(row);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1) {
      this.pageChange.emit(nuevaPagina);
    }
  }
}
