// Board button feature handler
function boardButtonsHandler(t) {
  return [{
    icon: './images/icon.png',
    text: 'Board Summary',
    callback: function(t) {
      return t.popup({
        title: 'Board Summary',
        url: './views/board-summary.html',
        height: 400
      });
    }
  }];
}
