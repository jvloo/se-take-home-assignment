import { OrderController } from '../domain/order-controller';
import { FakeClock } from '../domain/time.fake';
import { serializeBot, serializeSnapshot } from './serialize';

test('serializeBot includes the bot type and its resolved cook duration', () => {
  const c = new FakeClock();
  const ctrl = new OrderController(c, c);
  const dto = serializeBot(ctrl.addBot('FAST'));
  expect(dto.type).toBe('FAST');
  expect(dto.cookDurationMs).toBe(5_000);
});

test('serializeBot defaults to a NORMAL bot with a 10s cook duration', () => {
  const c = new FakeClock();
  const ctrl = new OrderController(c, c);
  const dto = serializeBot(ctrl.addBot());
  expect(dto.type).toBe('NORMAL');
  expect(dto.cookDurationMs).toBe(10_000);
});

test('serializeSnapshot carries cook duration per bot, not as a global field', () => {
  const c = new FakeClock();
  const ctrl = new OrderController(c, c);
  ctrl.addBot('FAST');
  const dto = serializeSnapshot(ctrl.snapshot());
  expect(dto).not.toHaveProperty('cookDurationMs');
  expect(dto.bots[0]!.cookDurationMs).toBe(5_000);
});
