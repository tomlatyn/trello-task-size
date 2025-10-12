// Main Trello Power-Up initialization
import { cardButtonsHandler } from './features/card-buttons.js';

// Initialize the Power-Up
window.TrelloPowerUp.initialize({
  'card-buttons': cardButtonsHandler,
  // Add more capabilities here as you expand features
  // 'card-badges': cardBadgesHandler,
  // 'card-detail-badges': cardDetailBadgesHandler,
});
