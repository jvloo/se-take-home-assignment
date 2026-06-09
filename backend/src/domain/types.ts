export type OrderType = 'NORMAL' | 'VIP';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETE';
export type BotStatus = 'IDLE' | 'PROCESSING';
export type BotType = 'NORMAL' | 'FAST';

export interface Order {
  id: number;
  type: OrderType;
  status: OrderStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
export interface Bot {
  id: number;
  type: BotType;
  status: BotStatus;
  cookMs: number; // resolved cook duration for this bot (depends on its type)
  currentOrderId: number | null;
}

export type DomainEvent =
  | { type: 'OrderCreated'; order: Order; at: Date }
  | { type: 'OrderStarted'; order: Order; botId: number; at: Date }
  | { type: 'OrderCompleted'; order: Order; botId: number; at: Date }
  | { type: 'OrderRequeued'; order: Order; botId: number; at: Date }
  | { type: 'BotAdded'; botId: number; at: Date }
  | { type: 'BotRemoved'; botId: number; wasProcessing: boolean; at: Date }
  | { type: 'BotIdle'; botId: number; at: Date };

export interface StatusSnapshot {
  pending: Order[];
  processing: { order: Order; botId: number }[];
  complete: Order[];
  bots: Bot[];
}
