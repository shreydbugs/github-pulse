import { test } from 'node:test';
import assert from 'node:assert';
import { resolveLocation } from './locationResolver.js';

test('Location Resolver', async (t) => {
  await t.test('resolves exact match', () => {
    const res = resolveLocation('San Francisco');
    assert.strictEqual(res.name, 'San Francisco');
    assert.strictEqual(res.country, 'United States');
  });

  await t.test('resolves partial match', () => {
    const res = resolveLocation('Pune, India');
    assert.strictEqual(res.name, 'Pune');
    assert.strictEqual(res.country, 'India');
  });

  await t.test('resolves country match', () => {
    const res = resolveLocation('Germany');
    assert.strictEqual(res.name, 'Germany');
    assert.strictEqual(res.country, 'Germany');
  });

  await t.test('returns null for unknown locations', () => {
    const res = resolveLocation('Middle of Nowhere');
    assert.strictEqual(res, null);
  });
  
  await t.test('handles empty and null safely', () => {
    assert.strictEqual(resolveLocation(''), null);
    assert.strictEqual(resolveLocation(null), null);
    assert.strictEqual(resolveLocation(undefined), null);
  });
});
