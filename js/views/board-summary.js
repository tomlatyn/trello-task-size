var Promise = window.TrelloPowerUp.Promise;
var t = window.TrelloPowerUp.iframe();

function getFilters() {
  return t.get('board', 'shared', 'summaryFilters')
  .then(function(filters) {
    return filters || { cardName: '', selectedUsers: [] };
  });
}

function applyFilters(cards, filters) {
  var filteredCards = cards;

  if (filters.cardName && filters.cardName.trim() !== '') {
    var searchTerm = filters.cardName.toLowerCase();
    filteredCards = filteredCards.filter(function(card) {
      return card.name.toLowerCase().includes(searchTerm);
    });
  }

  if (filters.selectedUsers && filters.selectedUsers.length > 0) {
    filteredCards = filteredCards.filter(function(card) {
      if (!card.idMembers || card.idMembers.length === 0) {
        return false;
      }
      return card.idMembers.some(function(memberId) {
        return filters.selectedUsers.includes(memberId);
      });
    });
  }

  return filteredCards;
}

function loadBoardSummary() {
  var loading = document.getElementById('loading');
  var summaryList = document.getElementById('summary-list');

  Promise.all([
    t.lists('all'),
    t.cards('all'),
    getFilters()
  ])
  .then(function(results) {
    var lists = results[0];
    var cards = results[1];
    var filters = results[2];
    var filteredCards = applyFilters(cards, filters);

    var listSummaries = new Map();

    lists.forEach(function(list) {
      listSummaries.set(list.id, {
        name: list.name,
        estimation: 0,
        delivered: 0
      });
    });

    var promises = filteredCards.map(function(card) {
      return t.get(card.id, 'shared', 'taskData')
      .then(function(taskData) {
        if (taskData && listSummaries.has(card.idList)) {
          var listSummary = listSummaries.get(card.idList);

          if (taskData.estimation !== undefined && taskData.estimation !== null) {
            listSummary.estimation += parseFloat(taskData.estimation) || 0;
          }

          if (taskData.delivered !== undefined && taskData.delivered !== null) {
            listSummary.delivered += parseFloat(taskData.delivered) || 0;
          }
        }
      });
    });

    return Promise.all(promises).then(function() {
      return listSummaries;
    });
  })
  .then(function(listSummaries) {
    loading.style.display = 'none';
    summaryList.innerHTML = '';

    listSummaries.forEach(function(summary) {
      var listItem = document.createElement('div');

      listItem.innerHTML =
        '<strong>' + summary.name + '</strong> - ' +
        'Estimation: ' + summary.estimation.toFixed(1) + ' | ' +
        'Delivered: ' + summary.delivered.toFixed(1);

      summaryList.appendChild(listItem);
    });
  })
  .catch(function(error) {
    loading.style.display = 'none';
    summaryList.innerHTML = '<div>Error: ' + error.message + '</div>';
    console.error('Error loading board summary:', error);
  });
}

document.getElementById('filter-button').addEventListener('click', function() {
  t.popup({
    title: 'Filters',
    url: './board-filters.html',
    height: 400
  }).then(function() {
    loadBoardSummary();
  });
});

t.render(function() {
  loadBoardSummary();
});
