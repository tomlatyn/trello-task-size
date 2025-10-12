// Card button feature handler
export function cardButtonsHandler(t) {
  return [{
    icon: 'https://cdn-icons-png.flaticon.com/512/3114/3114883.png',
    text: 'Task Size',
    callback: function(t) {
      return t.popup({
        title: 'Task Size SM',
        url: './views/popup.html',
        height: 280
      });
    }
  }];
}
