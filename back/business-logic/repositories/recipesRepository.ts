// server/business-logic/repositories/recetas.repository.ts
import { Receta } from '../../types/global';

// Esto luego puede conectarse a SQLite
let recetas: Receta[] = [
  {
    id: '1',
    nombre: 'Lentejas',
    tipo: 'plato_unico',
    contextos: ['comida'],
    ingredientes: ['lentejas', 'chorizo'],
    instrucciones: 'Cocinar todo junto',
    activa: true
  }
];

export function getRecetasFromDB(): Receta[] {
  return recetas;
}
