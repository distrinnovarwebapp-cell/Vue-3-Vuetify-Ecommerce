import Dexie, { type Table } from 'dexie';

export interface PedidoLocal {
  id?: number;
  firebaseId?: string;
  cliente: object;
  productos: any[];
  total: number;
  fecha: Date;
}

export class MyDatabase extends Dexie {
  pedidos!: Table<PedidoLocal>; 

  constructor() {
    super('BolsaDulceDB');
    this.version(1).stores({
      pedidos: '++id, firebaseId, fecha' // '++id' es auto-incrementable
    });
  }
}

export const dbLocal = new MyDatabase();