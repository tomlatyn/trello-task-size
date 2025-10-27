// Card detail badges feature handler
function cardDetailBadgesHandler(t) {
  return t.get('card', 'shared', 'taskData').then(function(taskData) {
    const badges = [];

    // If no task data exists, show a prompt to set task size
    if (!taskData || (taskData.estimation === undefined && taskData.delivered === undefined)) {
      badges.push({
        title: 'Task Size',
        text: 'Set Task Size',
        color: 'blue',
        callback: function(t) {
          return t.popup({
            title: 'Set Task Size',
            url: './views/popup.html?focus=estimation',
            height: 240
          });
        }
      });
      return badges;
    }

    // If task data exists, show estimation and delivered badges with click handlers
    if (taskData.estimation !== undefined && taskData.estimation !== null) {
      badges.push({
        title: 'Estimation',
        text: taskData.estimation.toString(),
        color: 'blue',
        callback: function(t) {
          return t.popup({
            title: 'Set Task Size',
            url: './views/popup.html?focus=estimation',
            height: 240
          });
        }
      });
    }

    if (taskData.delivered !== undefined && taskData.delivered !== null) {
      badges.push({
        title: 'Delivered',
        text: taskData.delivered.toString(),
        color: 'green',
        callback: function(t) {
          return t.popup({
            title: 'Set Task Size',
            url: './views/popup.html?focus=delivered',
            height: 240
          });
        }
      });
    }

    return badges;
  });
}
