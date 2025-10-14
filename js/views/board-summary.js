// Board summary view controller
const t = window.TrelloPowerUp.iframe();

const loading = document.getElementById('loading');
const summaryList = document.getElementById('summary-list');

async function loadBoardSummary() {
  try {
    // Get all visible lists on the board
    const lists = await t.lists('all');

    // Get all cards on the board
    const cards = await t.cards('all');

    // Create a map to store sums for each list
    const listSummaries = new Map();

    // Initialize list summaries
    lists.forEach(list => {
      listSummaries.set(list.id, {
        name: list.name,
        estimation: 0,
        delivered: 0
      });
    });

    // Process all cards and sum up their values
    for (const card of cards) {
      // Get task data for each card
      const taskData = await t.get(card.id, 'shared', 'taskData');

      if (taskData && listSummaries.has(card.idList)) {
        const listSummary = listSummaries.get(card.idList);

        if (taskData.estimation !== undefined && taskData.estimation !== null) {
          listSummary.estimation += parseFloat(taskData.estimation) || 0;
        }

        if (taskData.delivered !== undefined && taskData.delivered !== null) {
          listSummary.delivered += parseFloat(taskData.delivered) || 0;
        }
      }
    }

    // Hide loading and show results
    loading.style.display = 'none';

    // Display the summary
    if (listSummaries.size === 0) {
      summaryList.innerHTML = '<div class="no-data">No lists found</div>';
    } else {
      summaryList.innerHTML = '';

      listSummaries.forEach((summary, listId) => {
        const listItem = document.createElement('div');
        listItem.className = 'list-summary';

        listItem.innerHTML = `
          <div class="list-name">${summary.name}</div>
          <div class="list-stats">
            <span class="stat estimation">
              <span class="stat-label">Est:</span>
              <span class="stat-value">${summary.estimation.toFixed(1)}</span>
            </span>
            <span class="stat delivered">
              <span class="stat-label">Del:</span>
              <span class="stat-value">${summary.delivered.toFixed(1)}</span>
            </span>
          </div>
        `;

        summaryList.appendChild(listItem);
      });
    }

  } catch (error) {
    loading.style.display = 'none';
    summaryList.innerHTML = `<div class="error">Error loading summary: ${error.message}</div>`;
    console.error('Error loading board summary:', error);
  }
}

// Load the summary when the popup opens
loadBoardSummary();
