// Card badges feature handler (example for future feature)
// Uncomment and implement when ready to add badges

export function cardBadgesHandler(t) {
  return t.get('card', 'shared', 'taskSize').then(function(taskSize) {
    if (taskSize) {
      return [{
        text: `Size: ${taskSize}`,
        color: 'blue',
        icon: './images/icon.png'
      }];
    }
    return [];
  });
}
