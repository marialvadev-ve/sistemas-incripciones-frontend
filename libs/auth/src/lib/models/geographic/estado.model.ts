import { Pais } from './pais.model';

export interface Estado {
  id: string;
  nombre: string;
  paisId: string;
  pais?: Pais;
}
