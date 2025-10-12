// Main Trello Power-Up initialization
import { cardButtonsHandler } from './features/card-buttons.js';
import { cardBadgesHandler } from './features/card-badges.js';
import { cardDetailBadgesHandler } from './features/card-detail-badges.js';

// Initialize the Power-Up
window.TrelloPowerUp.initialize({
  'card-buttons': cardButtonsHandler,
  'card-badges': cardBadgesHandler,
  'card-detail-badges': cardDetailBadgesHandler,
});
