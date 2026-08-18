export type DialogType = 'confirmation' | 'warning' | 'danger';

export interface ConfirmDialogData {
  title: string;
  message: string;
  type?: DialogType; // Define el tipo de icono y color semántico
  confirmText?: string; // Texto personalizado para el botón de acción (Ej: 'Eliminar')
  cancelText?: string; // Texto personalizado para el botón de cancelar (Ej: 'Cancelar')
}
