export interface Universidad {
  id: string;
  nombre: string;
  siglas: string;
  rif: string;
  ubicacion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  permiteExcepcionExpedienteIncompleto?: boolean;
}
