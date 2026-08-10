import { Rol } from './rol.model';

export interface UsuarioRol {
  id: string;
  usuarioId: string;
  rolId: string;
  universidadId?: string | null;
  fechaInicio: string | Date;
  fechaFin?: string | Date | null;
  rol?: Rol;
}
