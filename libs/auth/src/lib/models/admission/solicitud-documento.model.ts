import { EstadoDocumento } from '../common/enums';

export interface SolicitudDocumento {
  id: string;
  solicitudId: string;
  tipoDocumentoId: string;
  estado: EstadoDocumento;
  observacion?: string | null;
  revisadoPorId?: string | null;
  revisadoEn?: string | Date | null;
}
