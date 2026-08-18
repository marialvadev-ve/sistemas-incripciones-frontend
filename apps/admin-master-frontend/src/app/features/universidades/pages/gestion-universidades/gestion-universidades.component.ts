import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { OnboardingUniversidad } from '../../models/onboarding-universidad';
import {
  CustomDialogConfirmComponent,
  DataTableLayoutComponent,
  NotificationService,
  TableColumn,
} from '@sistema-inscripciones-frontend/shared';
import { UniversidadStateService } from '../../services/universidad-state.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gestion-universidades',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataTableLayoutComponent],
  templateUrl: './gestion-universidades.component.html',
  styleUrls: ['./gestion-universidades.component.scss'],
})
export class GestionUniversidadesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  private stateService = inject(UniversidadStateService);
  private notification = inject(NotificationService);
  // Signal fuertemente tipada para la data
  universidades = this.stateService.universidades;

  // Columnas tipadas explícitamente para OnboardingUniversidad
  columnas: TableColumn<OnboardingUniversidad>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'siglas', label: 'Siglas' },
    { key: 'adminEmail', label: 'Email Admin' },
  ];

  currentPage = signal<number>(1);
  leftPanelWidth = signal<number>(60); // Ancho inicial del panel izquierdo en porcentaje (%)

  // Estado interno para el control del resizer
  private isResizing = false;

  ngOnInit(): void {
    this.stateService.cargarUniversidades();
  }

  // --- LÓGICA DEL RESIZER ---

  startResizing(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
  }

  onResize(event: MouseEvent): void {
    if (!this.isResizing) {
      return;
    }

    const containerWidth = window.innerWidth;
    if (containerWidth === 0) {
      return;
    }

    // Calcular el nuevo porcentaje basado en la posición horizontal del mouse
    const newWidthPercentage = (event.clientX / containerWidth) * 100;

    // Establecer límites de seguridad (por ejemplo, mínimo 20%, máximo 80%)
    if (newWidthPercentage >= 20 && newWidthPercentage <= 80) {
      this.leftPanelWidth.set(newWidthPercentage);
    }
  }

  stopResizing(): void {
    this.isResizing = false;
  }

  // --- EVENT HANDLERS DE NEGOCIO ---
  editarUniversidad(univ: OnboardingUniversidad): void {
    this.router.navigate(['editar', univ.id], { relativeTo: this.route });
  }

  eliminarUniversidad(universidad: OnboardingUniversidad): void {
    this.opendialog(universidad);
  }

  opendialog(universidad: OnboardingUniversidad) {
    const dialogRef = this.dialog.open(CustomDialogConfirmComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Registro',
        message: `Seguro que desea eliminar la ${universidad.nombre}?`,
        type: 'danger', // Tipo confirmación
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.stateService.eliminarUniversidad(universidad.id).subscribe({
          next: () => {
            this.notification.success(`La universidad ${universidad.nombre} fue eliminada con éxito.`);
          },
          error: (err) => {
            this.notification.error(err.message || 'Ocurrió un error al intentar eliminar la universidad.');
          },
        });
      }
    });
  }

  irCrear(): void {
    this.router.navigate(['crear'], { relativeTo: this.route });
  }

  onSearch(query: string): void {
    console.log('Filtro de búsqueda aplicado:', query);
    // TODO: Implementar filtrado de registros
  }
}
