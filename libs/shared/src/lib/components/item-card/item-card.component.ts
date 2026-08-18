import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Identifiable } from '../../models/identifiable/identifiable.model';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: unknown, row: T) => unknown;
}

@Component({
  selector: 'lib-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent<T extends Identifiable> {
  @Input({ required: true }) item!: T;
  @Input({ required: true }) columns: TableColumn<T>[] = [];

  @Output() delete = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();

  // Conversión segura del item a un record indexable sin usar 'any'
  private getItemAsRecord(): Record<string, unknown> {
    return this.item as unknown as Record<string, unknown>;
  }

  // Métodos seguros para soporte de logo opcional sin afectar el tipado estricto
  hasLogo(): boolean {
    const record = this.getItemAsRecord();
    return !!record['logo'] && typeof record['logo'] === 'string';
  }

  getLogo(): string {
    const record = this.getItemAsRecord();
    return (record['logo'] as string) || '';
  }

  getNombreCard(): string {
    if (!this.columns || this.columns.length === 0) {
      return '';
    }
    const primeraCol = this.columns[0].key;
    const record = this.getItemAsRecord();
    const value = record[String(primeraCol)];

    return value !== null && value !== undefined ? String(value) : '';
  }

  getSiglas(): string {
    const record = this.getItemAsRecord();
    if ('siglas' in record && typeof record['siglas'] === 'string') {
      return record['siglas'];
    }
    const nombre = this.getNombreCard();
    return nombre ? nombre.substring(0, 2).toUpperCase() : 'SN';
  }

  getDisplaySiglas(): string {
    return this.getSiglas();
  }

  getAvatarColor(): string {
    // Color de respaldo consistente para el avatar
    return '#3b82f6';
  }

  formatCell(col: TableColumn<T>): unknown {
    const record = this.getItemAsRecord();
    const value = record[String(col.key)];

    if (col.format) {
      return col.format(value, this.item);
    }
    return value ?? '';
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item);
  }
}
