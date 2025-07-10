// for the moment , pass types to orm model definitions
export type RecetaTipo = 'plato_unico' | 'primero' | 'segundo' | 'acompanante' | 'postre';

export type Receta = {
  id: string;
  nombre: string;
  tipo: RecetaTipo;
  contextos: ('comida' | 'cena')[];
  ingredientes: string[];
  instrucciones: string;
  notas?: string;
  activa: boolean;
};
