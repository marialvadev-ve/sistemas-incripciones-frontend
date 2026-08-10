export interface Universidad {
  id: string;
  nombre: string;
  siglas: string;
  ubicacion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  permiteExcepcionExpedienteIncompleto: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
