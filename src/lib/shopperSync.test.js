import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FRESH_FOR, shouldRefreshOnReturn } from './shopperSync.js'

const now = 1_000_000
const longAgo = now - FRESH_FOR - 1
const shopping = { now, loadedAt: longAgo, ready: true, error: null, hasItems: true }

test('returning to a tab that saved something asks the server again', () => {
  assert.equal(shouldRefreshOnReturn(shopping), true)
})

test('a tab asked less than FRESH_FOR ago does not ask again', () => {
  assert.equal(shouldRefreshOnReturn({ ...shopping, loadedAt: now - 1000 }), false)
  assert.equal(shouldRefreshOnReturn({ ...shopping, loadedAt: now - 1000, error: 'Can’t reach the shop' }), false)
})

test('exactly FRESH_FOR later it may ask again', () => {
  assert.equal(shouldRefreshOnReturn({ ...shopping, loadedAt: now - FRESH_FOR }), true)
})

test('a visitor who never saved anything does not hit the API on focus', () => {
  assert.equal(shouldRefreshOnReturn({ ...shopping, hasItems: false }), false)
})

test('a tab whose first load has not happened yet leaves that load alone', () => {
  assert.equal(shouldRefreshOnReturn({ ...shopping, ready: false }), false)
})

test('a failed load is tried again on return, even for a visitor with nothing saved', () => {
  assert.equal(shouldRefreshOnReturn({ ...shopping, hasItems: false, error: 'Can’t reach the shop' }), true)
})
