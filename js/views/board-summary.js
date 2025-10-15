// Board summary view controller
const t = window.TrelloPowerUp.iframe();

const loading = document.getElementById('loading');
const summaryList = document.getElementById('summary-list');
const filterButton = document.getElementById('filter-button');

// Load filters from storage
async function getFilters() {
  const filters = await t.get('board', 'shared', 'summaryFilters');
  return filters || { cardName: '', selectedUsers: [] };
}

// Apply filters to cards
function applyFilters(cards, filters) {
  let filteredCards = cards;

  // Filter by card name
  if (filters.cardName && filters.cardName.trim() !== '') {
    const searchTerm = filters.cardName.toLowerCase();
    filteredCards = filteredCards.filter(card =>
      card.name.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by users (only if users are selected)
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
  try {
    // Get all lists, cards, and members on the board
    const lists = await t.lists('all');
    const cards = await t.cards('all');
    const members = await t.board('members');

    // Get current filters
    const filters = await getFilters();

    // Apply filters to cards
    const filteredCards = applyFilters(cards, filters);

    // Create a map to store sums for each list
    const listSummaries = new Map();

    // Process filtered cards and sum up their values by list
    for (const card of filteredCards) {
      // Get task data for each card
      const taskData = await t.get(card.id, 'shared', 'taskData');

      if (taskData) {
        // Initialize the list summary if not exists
        if (!listSummaries.has(card.idList)) {
          // Find the list name
          const list = lists.find(l => l.id === card.idList);
          if (list) {
            listSummaries.set(card.idList, {
              name: list.name,
              estimation: 0,
              delivered: 0
            });
          }
        }

        // Add values to the list summary
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

    // Hide loading and show results
    loading.style.display = 'none';

    // Display the summary
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
    summaryList.innerHTML = `<div>Error loading summary: ${error.message}</div>`;
    console.error('Error loading board summary:', error);
  }
}

// Open filters popup
filterButton.addEventListener('click', function() {
  t.popup({
    title: 'Filters',
    url: './board-filters.html',
    height: 400
  });
});

// Listen for filter changes from the filter popup
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'filtersUpdated') {
    loadBoardSummary();
  }
});

// Load the summary when the popup opens
loadBoardSummary();
