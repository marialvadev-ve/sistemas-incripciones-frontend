import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DataTableLayoutComponent, TableColumn } from '@sistema-inscripciones-frontend/shared';
import { OnboardingUniversidad } from '../../models/onboarding-universidad';

@Component({
  selector: 'app-gestion-universidades',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataTableLayoutComponent],
  templateUrl: './gestion-universidades.component.html',
  styleUrls: ['./gestion-universidades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionUniversidadesComponent {
  private router = inject(Router);

  // Columnas dinámicas para la tabla reutilizable
  columnas: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'siglas', label: 'Siglas' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correoInstitucional', label: 'Correo Inst.' },
    { key: 'adminEmail', label: 'Admin Email' },
  ];

  // Mock de datos (aquí conectarías tu servicio real)
  universidades = signal([
    {
      id: '1',
      nombre: 'Universidad Politécnica Territorial',
      siglas: 'UPT',
      telefono: '0251-4445566',
      correoInstitucional: 'info@upt.edu.ve',
      adminEmail: 'admin@upt.edu.ve',
      avatarColor: '#0ea5e9',
    },
    {
      id: '2',
      nombre: 'Universidad Centroccidental',
      siglas: 'UCLA',
      telefono: '0251-9988776',
      correoInstitucional: 'contacto@ucla.edu.ve',
      adminEmail: 'rectorado@ucla.edu.ve',
      avatarColor: '#8b5cf6',
    },
  ]);

  isLoading = signal(false);
  currentPage = signal(1);

  // Control para el ancho dinámico del panel izquierdo (Resizable Split)
  leftPanelWidth = signal(45); // Porcentaje inicial del panel izquierdo (Formulario)
  isResizing = false;

  // Manejador para redimensionar con el mouse
  startResizing(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();
  }

  onResize(event: MouseEvent): void {
    if (!this.isResizing) return;
    const containerWidth = window.innerWidth;
    const newWidthPercentage = (event.clientX / containerWidth) * 100;

    // Limitar entre 25% y 75% para evitar colapsos visuales
    if (newWidthPercentage >= 25 && newWidthPercentage <= 75) {
      this.leftPanelWidth.set(newWidthPercentage);
    }
  }

  stopResizing(): void {
    this.isResizing = false;
  }

  // Eventos de Navegación y Acciones
  irCrear(): void {
    this.router.navigate(['/universidades/crear']);
  }

  editarUniversidad(row: OnboardingUniversidad): void {
    this.router.navigate([`/universidades/editar`, row.id]);
  }

  eliminarUniversidad(row: OnboardingUniversidad): void {
    const confirmar = window.confirm(`¿Estás segura de eliminar la universidad ${row.nombre}?`);
    if (confirmar) {
      this.isLoading.set(true);
      // Simulación de llamada a endpoint de eliminación
      setTimeout(() => {
        this.universidades.update((list) => list.filter((item) => item.id !== row.id));
        this.isLoading.set(false);
      }, 600);
    }
  }

  onSearch(termino: string): void {
    console.log('Buscando:', termino);
  }
}
