import { EstadoCivil, Genero, TipoVivienda } from '../common/enums';

export interface Persona {
  id: string;
  cedula: string;
  nacionalidad: string;
  nombres: string;
  apellidos: string;
  genero: Genero;
  estadoCivil: EstadoCivil;
  fechaNacimiento: string | Date;
  telefono: string;
  correo: string;
  paisId: string;
  estadoId: string;
  municipioId: string;
  parroquiaId: string;
  localidad?: string | null;
  calle?: string | null;
  numeroCasa?: string | null;
  puntoReferencia?: string | null;
  tipoVivienda: TipoVivienda;
  createdAt: string | Date;
  updatedAt: string | Date;
}
