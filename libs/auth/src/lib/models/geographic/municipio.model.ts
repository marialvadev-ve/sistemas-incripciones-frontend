import { Estado } from './estado.model';

export interface Municipio {
  id: string;
  nombre: string;
  estadoId: string;
  estado?: Estado;
}
