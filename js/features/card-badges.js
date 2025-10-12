// Card badges feature handler
function cardBadgesHandler(t) {
  return t.get('card', 'shared', 'taskData').then(function(taskData) {
    const badges = [];

    if (taskData) {
      if (taskData.estimation !== undefined && taskData.estimation !== null) {
        badges.push({
          text: taskData.estimation.toString(),
          color: 'blue',
          icon: './images/estimation.png'
        });
      }

      if (taskData.delivered !== undefined && taskData.delivered !== null) {
        badges.push({
          text: taskData.delivered.toString(),
          color: 'green',
          icon: './images/delivered.png'
        });
      }
    }

    return badges;
  });
}
