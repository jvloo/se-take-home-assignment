import type { StatusDTO, BotDTO } from '@contracts';

describe('@contracts alias', () => {
  it('StatusDTO shape is structurally valid with per-bot cook duration', () => {
    const bot: BotDTO = {
      id: 1,
      type: 'FAST',
      status: 'IDLE',
      cookDurationMs: 5000,
      currentOrderId: null,
    };
    const status: StatusDTO = {
      pending: [],
      processing: [],
      complete: [],
      bots: [bot],
    };

    expect(status.pending).toEqual([]);
    expect(status.bots[0]?.type).toBe('FAST');
    expect(status.bots[0]?.cookDurationMs).toBe(5000);
  });
});
