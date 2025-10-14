// Board button feature handler
function boardButtonsHandler(t) {
  return [{
    icon: './images/icon.png',
    text: 'Column Summary',
    callback: function(t) {
      return t.popup({
        title: 'Column Summary',
        url: './views/board-summary.html',
        height: 400
      });
    }
  }];
}
