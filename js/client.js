// Main Trello Power-Up initialization

// Card button feature handler
function cardButtonsHandler(t) {
  return [{
    icon: './images/icon.png',
    text: 'Task Size',
    callback: function(t) {
      return t.popup({
        title: 'Task Size SM',
        url: './views/popup.html'
      });
    }
  }];
}

// Card badges feature handler
function cardBadgesHandler(t) {
  return t.get('card', 'shared', 'taskData').then(function(taskData) {
    const badges = [];

    if (taskData) {
      if (taskData.estimation !== undefined && taskData.estimation !== null) {
        badges.push({
          text: `Est: ${taskData.estimation}`,
          color: 'blue',
          icon: './images/icon.png'
        });
      }

      if (taskData.delivered !== undefined && taskData.delivered !== null) {
        badges.push({
          text: `Del: ${taskData.delivered}`,
          color: 'green'
        });
      }
    }

    return badges;
  });
}

// Card detail badges feature handler
function cardDetailBadgesHandler(t) {
  return t.get('card', 'shared', 'taskData').then(function(taskData) {
    const badges = [];

    if (taskData) {
      if (taskData.estimation !== undefined && taskData.estimation !== null) {
        badges.push({
          title: 'Estimation',
          text: taskData.estimation.toString(),
          color: 'blue'
        });
      }

      if (taskData.delivered !== undefined && taskData.delivered !== null) {
        badges.push({
          title: 'Delivered',
          text: taskData.delivered.toString(),
          color: 'green'
        });
      }
    }

    return badges;
  });
}

// Initialize the Power-Up
window.TrelloPowerUp.initialize({
  'card-buttons': cardButtonsHandler,
  'card-badges': cardBadgesHandler,
  'card-detail-badges': cardDetailBadgesHandler,
});
