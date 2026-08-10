export interface ProgramaFormacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  nivelAcademicoId: string;
  universidadId: string;
}
