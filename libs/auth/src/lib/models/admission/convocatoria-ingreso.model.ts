import { Universidad } from '../../../../../shared/src/lib/models/university/universidad.model';

export interface ConvocatoriaIngreso {
  id: string;
  universidadId: string;
  universidad?: Universidad;
  nombre: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  activa: boolean;
}
