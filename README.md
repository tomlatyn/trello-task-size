# Task Size SM - Trello Power-Up

A Trello Power-Up for managing task sizes and estimates on your cards.

## Features

- **Card Button**: Adds a "Task Size" button to each card
- **Popup Interface**: Select task sizes (XS, S, M, L, XL) through an easy-to-use popup

## Project Structure

```
trello-task-size/
├── manifest.json              # Power-Up manifest configuration
├── index.html                 # Main entry point
├── js/
│   ├── client.js              # Main Power-Up initialization
│   ├── features/              # Feature modules (modular architecture)
│   │   ├── card-buttons.js    # Card button handler
│   │   └── card-badges.js     # Card badges handler (example)
│   ├── views/                 # View controllers
│   │   └── popup.js           # Popup view logic
│   └── utils/                 # Utility functions
│       └── storage.js         # Storage helpers
├── views/
│   └── popup.html             # Popup UI
├── styles/
│   ├── main.css               # Global styles
│   └── popup.css              # Popup-specific styles
└── images/
    └── icon.png               # Power-Up icon (add your own)
```

## Setup

1. **Host the Power-Up**: Host all files on a public HTTPS server or use a service like:
   - GitHub Pages
   - Glitch
   - Netlify
   - Vercel

2. **Create the Power-Up in Trello**:
   - Go to https://trello.com/power-ups/admin
   - Click "Create New Power-Up"
   - Enter your Power-Up details
   - Set the iframe connector URL to your hosted `index.html`
   - Upload the manifest.json or enter the details manually

3. **Enable the Power-Up**:
   - Open any Trello board
   - Click "Power-Ups" in the menu
   - Find "Task Size SM" under "Custom"
   - Click "Add" to enable it

## Adding New Features

The project is structured for easy feature expansion:

### 1. Add a new feature handler

Create a new file in `js/features/`:

```javascript
// js/features/my-new-feature.js
export function myNewFeatureHandler(t) {
  // Your feature logic here
}
```

### 2. Import and register in client.js

```javascript
// js/client.js
import { myNewFeatureHandler } from './features/my-new-feature.js';

window.TrelloPowerUp.initialize({
  'card-buttons': cardButtonsHandler,
  'my-new-capability': myNewFeatureHandler,
});
```

### 3. Update manifest.json capabilities

Add the new capability to `manifest.json`:

```json
{
  "capabilities": [
    "card-buttons",
    "my-new-capability"
  ]
}
```

## Available Trello Capabilities

You can add any of these capabilities to expand functionality:

- `card-badges` - Display badges on card fronts
- `card-back-section` - Add sections to card backs
- `card-detail-badges` - Display detailed badges
- `board-buttons` - Add buttons to boards
- `list-actions` - Add actions to lists
- `show-settings` - Add settings panel
- `authorization-status` - Handle auth status
- `show-authorization` - Show auth UI

## Development

For local development, you can use a tool like `http-server` or any local web server:

```bash
npx http-server -p 8080
```

Then use a tunneling service like ngrok to expose it:

```bash
ngrok http 8080
```

Use the ngrok HTTPS URL as your Power-Up's iframe connector URL during development.

## License

MIT
