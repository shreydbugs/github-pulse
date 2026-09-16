import { test } from 'node:test';
import assert from 'node:assert';
import { addEvents, getState } from './store.js';

test('Event Store', async (t) => {
  await t.test('adds events and deduplicates', () => {
    const events = [
      { id: '1', type: 'Push' },
      { id: '2', type: 'PullRequest' }
    ];
    addEvents(events);
    
    let state = getState();
    assert.strictEqual(state.events.length, 2);
    
    // Add same events again
    addEvents(events);
    state = getState();
    assert.strictEqual(state.events.length, 2);
    
    // Add new event
    addEvents([{ id: '3', type: 'Issue' }]);
    state = getState();
    assert.strictEqual(state.events.length, 3);
  });
});
