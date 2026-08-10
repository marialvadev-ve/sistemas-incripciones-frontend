import { Municipio } from './municipio.model';

export interface Parroquia {
  id: string;
  nombre: string;
  municipioId: string;
  municipio?: Municipio;
}
