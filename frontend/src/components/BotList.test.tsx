import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BotList } from './BotList';
import type { BotDTO, OrderDTO } from '@contracts';

function bot(
  id: number,
  status: BotDTO['status'],
  currentOrderId: number | null,
  type: BotDTO['type'] = 'NORMAL',
  cookDurationMs = 10000,
): BotDTO {
  return { id, type, status, cookDurationMs, currentOrderId };
}

function order(id: number, type: OrderDTO['type'], startedAt?: string): OrderDTO {
  return {
    id,
    type,
    status: 'PROCESSING',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...(startedAt !== undefined ? { startedAt } : {}),
  };
}

describe('BotList', () => {
  it('shows an empty state when there are no bots', () => {
    render(<BotList bots={[]} processing={[]} />);
    expect(screen.getByText(/no bots/i)).toBeDefined();
  });

  it('renders the bot count', () => {
    render(<BotList bots={[]} processing={[]} />);
    expect(screen.getByText('0')).toBeDefined();
  });

  it('lists bots by id with their status', () => {
    const bots = [bot(1, 'IDLE', null), bot(2, 'PROCESSING', 1001)];
    render(<BotList bots={bots} processing={[]} />);
    expect(screen.getByText('Bot #1')).toBeDefined();
    expect(screen.getByText('Bot #2')).toBeDefined();
  });

  it('shows a per-bot status badge', () => {
    const bots = [bot(1, 'IDLE', null)];
    render(<BotList bots={bots} processing={[]} />);
    expect(screen.getByText(/idle/i)).toBeDefined();
  });

  it('renders countdown for a processing bot using startedAt + the bot cook duration', () => {
    const now = Date.now();
    const startedAt = new Date(now - 3000).toISOString();
    const bots = [bot(1, 'PROCESSING', 1001)];
    const processing = [
      {
        order: order(1001, 'NORMAL', startedAt),
        botId: 1,
      },
    ];
    render(<BotList bots={bots} processing={processing} />);
    // NORMAL bot: 10s cook started 3s ago → ~7s remaining
    expect(screen.getByText(/7s/)).toBeDefined();
  });

  it('uses the FAST bot 5s cook time for its countdown', () => {
    const now = Date.now();
    const startedAt = new Date(now - 1000).toISOString();
    const bots = [bot(1, 'PROCESSING', 1001, 'FAST', 5000)];
    const processing = [
      {
        order: order(1001, 'NORMAL', startedAt),
        botId: 1,
      },
    ];
    render(<BotList bots={bots} processing={processing} />);
    // FAST bot: 5s cook started 1s ago → ~4s remaining
    expect(screen.getByText(/4s/)).toBeDefined();
  });

  it('flags a FAST bot visually but leaves a NORMAL bot unlabelled', () => {
    const bots = [bot(1, 'IDLE', null, 'FAST', 5000), bot(2, 'IDLE', null, 'NORMAL', 10000)];
    render(<BotList bots={bots} processing={[]} />);
    expect(screen.getByText(/fast/i)).toBeDefined();
    expect(screen.getByText('Bot #1')).toBeDefined();
    expect(screen.getByText('Bot #2')).toBeDefined();
  });

  it('shows "No order queued" for an idle bot', () => {
    const bots = [bot(1, 'IDLE', null)];
    render(<BotList bots={bots} processing={[]} />);
    expect(screen.getByText(/no order queued/i)).toBeDefined();
  });

  it('renders a countdown (Ns) on the order row for a PROCESSING bot', () => {
    const now = Date.now();
    const startedAt = new Date(now - 3000).toISOString();
    const bots = [bot(1, 'PROCESSING', 1001)];
    const processing = [
      {
        order: order(1001, 'NORMAL', startedAt),
        botId: 1,
      },
    ];
    render(<BotList bots={bots} processing={processing} />);
    expect(screen.getByText(/7s/)).toBeDefined();
  });

  it('renders nothing extra for zero bots beyond empty state', () => {
    render(<BotList bots={[]} processing={[]} />);
    expect(screen.getByText(/no bots/i)).toBeDefined();
  });
});
