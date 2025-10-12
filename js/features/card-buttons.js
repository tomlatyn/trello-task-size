// Card button feature handler
export function cardButtonsHandler(t) {
  return [{
    icon: './images/icon.png',
    text: 'Task Size',
    callback: function(t) {
      return t.popup({
        title: 'Task Size SM',
        url: './views/popup.html',
        height: 184
      });
    }
  }];
}
