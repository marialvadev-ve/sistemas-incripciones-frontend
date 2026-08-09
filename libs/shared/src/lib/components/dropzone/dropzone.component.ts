import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-dropzone',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropzoneComponent {
  label = input<string>('Arrastra tus archivos aquí o haz clic para explorar');
  acceptedFormats = input<string>('.pdf,.jpg,.png');
  maxSizeMb = input<number>(5);
  multiple = input<boolean>(false);

  /**
   * NUEVO: Controla si se abre directamente la cámara del dispositivo móvil.
   * Por defecto está en falso para mantener el comportamiento clásico de galería/archivos.
   */
  enableCapture = input<boolean>(false);

  // Evento de salida hacia el componente padre (sin prefijo "on")
  filesSelected = output<File[]>();

  isDragging = signal<boolean>(false);
  selectedFiles = signal<File[]>([]);
  errorMessage = signal<string | null>(null);

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  public onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.handleFiles(Array.from(inputElement.files));
      inputElement.value = '';
    }
  }

  private handleFiles(files: File[]): void {
    this.errorMessage.set(null);
    const validFiles: File[] = [];
    const maxBytes = this.maxSizeMb() * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxBytes) {
        this.errorMessage.set(`El archivo "${file.name}" supera el límite de ${this.maxSizeMb()}MB.`);
        continue;
      }
      validFiles.push(file);
      if (!this.multiple()) {
        break;
      }
    }

    if (validFiles.length > 0) {
      this.selectedFiles.set(validFiles);
      this.filesSelected.emit(validFiles);
    }
  }

  public removeFile(index: number, event: MouseEvent): void {
    event.stopPropagation();
    const current = [...this.selectedFiles()];
    current.splice(index, 1);
    this.selectedFiles.set(current);
    this.filesSelected.emit(current);
  }
}
