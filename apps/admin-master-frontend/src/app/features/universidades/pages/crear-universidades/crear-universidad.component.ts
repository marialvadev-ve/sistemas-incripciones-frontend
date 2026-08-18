import { Component, ChangeDetectionStrategy, inject, effect, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  correoEstrictoValidator,
  FormErrorComponent,
  InputComponent,
  NotificationService,
  rifVenezolanoValidator,
  telefonoVenezolanoValidator,
  EntityState,
  CustomDialogConfirmComponent,
  Universidad,
} from '@sistema-inscripciones-frontend/shared';
import { OnboardingUniversidad } from '../../models/onboarding-universidad';
import { UniversidadStateService } from '../../services/universidad-state.service'; // <-- Importante: Usamos el estado global
import { AuthStore } from '@sistema-inscripciones-frontend/auth';
import { ResponseUniversidad } from '../../services/universidad.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModificarEmailDialogComponent } from './modificar-email-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-crear-universidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormErrorComponent, MatIcon],
  templateUrl: './crear-universidad.component.html',
  styleUrls: ['./crear-universidad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearUniversidadComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private fb = inject(NonNullableFormBuilder);
  private readonly authStore = inject(AuthStore);
  private notification = inject(NotificationService);
  private universidadStateService = inject(UniversidadStateService); // <-- Inyectamos el servicio de estado

  protected readonly isLoading = this.authStore.isLoading;
  isEditMode = false;
  universidadModel: OnboardingUniversidad = {
    id: '',
    nombre: '',
    siglas: '',
    rif: '',
    ubicacion: '',
    telefono: '',
    correoInstitucional: '',
    adminEmail: '',
    isDirty: 'CREATE', // Inicia en CREATE por defecto para un nuevo registro
  };

  // Recibe automáticamente el ID si la ruta es /editar/:id gracias a withComponentInputBinding()
  id = input<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    siglas: [''],
    rif: ['', [Validators.required, rifVenezolanoValidator()]],
    ubicacion: [''],
    telefono: ['', [telefonoVenezolanoValidator()]],
    correoInstitucional: ['', [Validators.required, Validators.email, correoEstrictoValidator()]],
    correoUserAdmin: ['', [Validators.required, Validators.email, correoEstrictoValidator()]],
  });

  // El effect detecta automáticamente si hay un ID en la URL de forma reactiva
  private loadDataEffect = effect(() => {
    const universidadId = this.id();
    this.isEditMode = false;

    if (universidadId) {
      this.cargarModoEdicion(universidadId);
    } else {
      this.modoCreacion();
    }
  });

  ngOnInit(): void {
    // TODA LA LÓGICA DE SUSCRIPCIÓN SE COLOCA AQUÍ
    this.form.valueChanges.subscribe((values) => {
      this.universidadModel.nombre = values.nombre;
      this.universidadModel.siglas = values.siglas;
      this.universidadModel.rif = values.rif;
      this.universidadModel.ubicacion = values.ubicacion;
      this.universidadModel.telefono = values.telefono;
      this.universidadModel.correoInstitucional = values.correoInstitucional;
      this.universidadModel.adminEmail = values.correoUserAdmin;

      // Si estamos editando un registro que estaba en UNCHANGED y el usuario toca algo, pasa a MODIFY
      if (this.isEditMode && this.universidadModel.isDirty === 'UNCHANGED') {
        this.universidadModel.isDirty = 'MODIFY';
      }
    });
  }

  private cargarModoEdicion(id: string): void {
    // Buscamos la universidad en el estado actual o la consultamos
    const universidad = this.universidadStateService.getUniversidadById(id);
    if (universidad) {
      this.universidadModel = universidad;
      this.form.patchValue({
        nombre: universidad.nombre,
        siglas: universidad.siglas,
        rif: universidad.rif,
        ubicacion: universidad.ubicacion,
        telefono: universidad.telefono,
        correoInstitucional: universidad.correoInstitucional,
        correoUserAdmin: universidad.adminEmail,
      });
      this.isEditMode = true;
    }
  }

  private modoCreacion(): void {
    this.form.reset();
  }

  // Método para cerrar el formulario y regresar
  cerrarFormulario(): void {
    if (this.universidadModel.isDirty === 'UNCHANGED') {
      this.router.navigate(['/universidades']);
    } else {
      this.opendialog();
    }
  }

  opendialog() {
    const dialogRef = this.dialog.open(CustomDialogConfirmComponent, {
      width: '400px',
      data: {
        title: 'Advertencia',
        message: `Existen cambios pendientes por guardar, Deseas guardarlos?`,
        type: 'danger',
        confirmText: 'Si',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.onSubmit();
      } else {
        this.router.navigate(['/universidades']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const universidadId = this.id();
    const isDirty: EntityState = universidadId ? 'MODIFY' : 'CREATE';

    const dataSave: OnboardingUniversidad = {
      id: universidadId || '',
      nombre: formValues.nombre,
      siglas: formValues.siglas,
      rif: formValues.rif,
      ubicacion: formValues.ubicacion,
      telefono: formValues.telefono,
      correoInstitucional: formValues.correoInstitucional,
      adminEmail: formValues.correoUserAdmin,
      isDirty,
    };

    if (universidadId) {
      // --- MODO EDICIÓN ---
      const { isDirty, correoInstitucional, adminEmail, ...dataUni } = dataSave;
      const dataModified: Universidad = {
        ...dataUni,
        correo: correoInstitucional,
      };
      this.universidadStateService.actualizarUniversidad(universidadId, dataModified).subscribe({
        next: () => {
          this.notification.success(`La Universidad ${dataSave.nombre} fue actualizada con éxito!`);
        },
        error: (err) => {
          this.notification.error(err.message || 'Error al actualizar la universidad');
        },
      });
    } else {
      // --- MODO CREACIÓN ---
      this.universidadStateService.crearUniversidad(dataSave).subscribe({
        next: (nuevaUniversidad: ResponseUniversidad) => {
          this.notification.success(`La Universidad ${nuevaUniversidad.universidad.nombre} fue creada con éxito!`);
        },
        error: (err) => {
          this.notification.error(err.message || 'Error al crear la universidad');
        },
      });
    }
  }

  abrirModalModificarEmail(): void {
    const correoActual = this.form.get('correoUserAdmin')?.value;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '420px';
    dialogConfig.panelClass = 'custom-email-dialog-panel';
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;

    // AQUÍ PASAS LA DATA
    dialogConfig.data = {
      correoActual: correoActual,
    };

    dialogConfig.position = {
      top: '350px',
      right: '150px',
    };

    const dialogRef = this.dialog.open(ModificarEmailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((nuevoCorreo: string) => {
      if (nuevoCorreo) {
        // Actualizamos el valor del control en el formulario reactivo
        this.form.get('correoUserAdmin')?.setValue(nuevoCorreo);
        this.form.get('correoUserAdmin')?.markAsDirty();

        // Aquí puedes agregar lógica adicional si requieres llamar a un servicio de actualización inmediato
      }
    });
  }
}
