// Card detail badges feature handler
export function cardDetailBadgesHandler(t) {
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
