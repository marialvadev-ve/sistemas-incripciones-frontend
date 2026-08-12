import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  format?: (value: unknown, row: T) => string;
}

@Component({
  selector: 'lib-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  @Input() item!: T;
  @Input() columns: TableColumn<T>[] = [];

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();

  getAvatarColor(): string {
    return (this.item['avatarColor'] as string) || '#2563eb';
  }

  getSiglas(): string {
    const siglas = this.item['siglas'] as string;
    const nombre = this.item['nombre'] as string;
    if (siglas) return siglas.charAt(0);
    if (nombre) return nombre.charAt(0);
    return 'U';
  }

  getDisplaySiglas(): string {
    return (this.item['siglas'] as string) || 'REG';
  }

  getNombreCard(): string {
    const nombre = this.item['nombre'] as string;
    if (nombre) return nombre;
    const primeraColumna = this.columns[0]?.key as string;
    return primeraColumna ? String(this.item[primeraColumna] ?? '') : '';
  }

  formatCell(col: TableColumn<T>): unknown {
    const value = this.item[col.key as string];
    if (col.format) {
      return col.format(value, this.item);
    }
    return value ?? '—';
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item);
  }
}
