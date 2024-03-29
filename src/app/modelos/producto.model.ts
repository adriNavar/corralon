
// src/app/modelos/producto.model.ts

export interface Producto {
  id?: string;
  nombre?: string;
  marca?: string;
  descripcion?: string;
  stock?: number;
  precio?: number;
  categoria?: string;
  imagen?: string | File;
  baja?:boolean;
  numero?:number;
}
