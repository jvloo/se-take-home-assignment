export type OrderType = 'NORMAL' | 'VIP';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETE';
export type BotStatus = 'IDLE' | 'PROCESSING';
export type BotType = 'NORMAL' | 'FAST';

export interface OrderDTO {
  id: number;
  type: OrderType;
  status: OrderStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BotDTO {
  id: number;
  type: BotType;
  status: BotStatus;
  cookDurationMs: number;
  currentOrderId: number | null;
}

export interface StatusDTO {
  pending: OrderDTO[];
  processing: { order: OrderDTO; botId: number }[];
  complete: OrderDTO[];
  bots: BotDTO[];
}

export interface CreateOrderBody {
  type?: OrderType;
}

export interface CreateBotBody {
  type?: BotType;
}
