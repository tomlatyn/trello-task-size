// Card button feature handler
function cardButtonsHandler(t) {
  return [{
    icon: './images/icon.png',
    text: 'Task Size SM',
    callback: function(t) {
      return t.popup({
        title: 'Task Size SM',
        url: './views/popup.html',
        height: 280
      });
    }
  }];
}
