
export enum StockStatus {
  InStock = 'in-stock',
  LowStock = 'low',
  OutOfStock = 'out-of-stock',
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: string;
}

export type InventoryItemData = Omit<InventoryItem, 'id' | 'lastUpdated'>;

export type FilterType = 'all' | 'in-stock' | 'low' | 'out-of-stock';
