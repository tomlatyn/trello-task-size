// Card badges feature handler
export function cardBadgesHandler(t) {
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
