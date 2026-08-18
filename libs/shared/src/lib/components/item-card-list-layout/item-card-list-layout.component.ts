import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ItemCardComponent, TableColumn } from '../item-card/item-card.component';
import { Identifiable } from '../../models/identifiable/identifiable.model';

@Component({
  selector: 'lib-item-card-list-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ItemCardComponent], // <-- AQUÍ SE AGREGA EL COMPONENTE
  templateUrl: './item-card-list-layout.component.html',
  styleUrls: ['./item-card-list-layout.component.scss'],
})
export class ItemCardListLayoutComponent<T extends Identifiable> implements OnInit, OnDestroy {
  @Input({ required: true }) title = '';
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) fields: TableColumn<T>[] = [];
  @Input() isLoading = false;
  @Input() totalRecords = 0;
  @Input() currentPage = 1;

  @Output() createAction = new EventEmitter<void>();
  @Output() editAction = new EventEmitter<T>();
  @Output() deleteAction = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();

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

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1) {
      this.pageChange.emit(nuevaPagina);
    }
  }
}
