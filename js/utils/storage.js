// Utility functions for data storage
export async function getCardData(t, key) {
  return await t.get('card', 'shared', key);
}

export async function setCardData(t, key, value) {
  return await t.set('card', 'shared', key, value);
}

export async function getBoardData(t, key) {
  return await t.get('board', 'shared', key);
}

export async function setBoardData(t, key, value) {
  return await t.set('board', 'shared', key, value);
}
