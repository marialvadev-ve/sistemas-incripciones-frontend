import { Universidad } from '../university/universidad.model';

export interface OrigenIngreso {
  id: string;
  universidadId: string;
  universidad?: Universidad;
  nombre: string;
  descripcion?: string | null;
}
