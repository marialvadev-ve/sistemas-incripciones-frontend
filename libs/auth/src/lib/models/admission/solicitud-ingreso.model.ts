import { EstadoSolicitud } from '../common/enums';
import { SolicitudDocumento } from './solicitud-documento.model';

export interface SolicitudIngreso {
  id: string;
  usuarioId: string;
  convocatoriaId: string;
  origenId: string;
  tipoIngresoId: string;
  especialidadId: string;
  estado: EstadoSolicitud;
  estudianteId?: string | null;
  observacionGeneral?: string | null;
  documentos?: SolicitudDocumento[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
