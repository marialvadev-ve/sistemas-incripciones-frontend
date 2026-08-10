import { Universidad } from '../university/universidad.model';

export interface TipoDocumento {
  id: string;
  universidadId: string;
  universidad?: Universidad;
  nombre: string;
  descripcion?: string | null;
  minImagenes: number;
  maxImagenes?: number | null;
  obligatorio: boolean;
  activo: boolean;
  orden: number;
}
