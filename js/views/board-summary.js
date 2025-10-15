const t = window.TrelloPowerUp.iframe();

async function getFilters() {
  const filters = await t.get('board', 'shared', 'summaryFilters');
  return filters || { cardName: '', selectedUsers: [] };
}

function applyFilters(cards, filters) {
  let filteredCards = cards;

  if (filters.cardName && filters.cardName.trim() !== '') {
    const searchTerm = filters.cardName.toLowerCase();
    filteredCards = filteredCards.filter(card =>
      card.name.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.selectedUsers && filters.selectedUsers.length > 0) {
    filteredCards = filteredCards.filter(card => {
      if (!card.idMembers || card.idMembers.length === 0) {
        return false;
      }
      return card.idMembers.some(memberId =>
        filters.selectedUsers.includes(memberId)
      );
    });
  }

  return filteredCards;
}

async function loadBoardSummary() {
  const loading = document.getElementById('loading');
  const summaryList = document.getElementById('summary-list');

  try {
    const lists = await t.lists('all');
    const cards = await t.cards('all');
    const filters = await getFilters();
    const filteredCards = applyFilters(cards, filters);

    const listSummaries = new Map();

    for (const card of filteredCards) {
      const taskData = await t.get(card.id, 'shared', 'taskData');

      if (taskData) {
        if (!listSummaries.has(card.idList)) {
          const list = lists.find(l => l.id === card.idList);
          if (list) {
            listSummaries.set(card.idList, {
              name: list.name,
              estimation: 0,
              delivered: 0
            });
          }
        }

        if (listSummaries.has(card.idList)) {
          const listSummary = listSummaries.get(card.idList);

          if (taskData.estimation !== undefined && taskData.estimation !== null) {
            listSummary.estimation += parseFloat(taskData.estimation) || 0;
          }

          if (taskData.delivered !== undefined && taskData.delivered !== null) {
            listSummary.delivered += parseFloat(taskData.delivered) || 0;
          }
        }
      }
    }

    loading.style.display = 'none';

    if (listSummaries.size === 0) {
      summaryList.innerHTML = '<div>No cards with data</div>';
    } else {
      summaryList.innerHTML = '';

      listSummaries.forEach((summary) => {
        const listItem = document.createElement('div');

        listItem.innerHTML = `
          <div><strong>${summary.name}</strong></div>
          <div>Estimation: ${summary.estimation.toFixed(1)}</div>
          <div>Delivered: ${summary.delivered.toFixed(1)}</div>
          <br>
        `;

        summaryList.appendChild(listItem);
      });
    }

  } catch (error) {
    loading.style.display = 'none';
    summaryList.innerHTML = `<div>Error: ${error.message}</div>`;
    console.error('Error loading board summary:', error);
  }
}

document.getElementById('filter-button').addEventListener('click', function() {
  t.popup({
    title: 'Filters',
    url: './board-filters.html',
    height: 400
  });
});

window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'filtersUpdated') {
    loadBoardSummary();
  }
});

t.render(function() {
  loadBoardSummary();
});
