// Board summary view controller
const t = window.TrelloPowerUp.iframe();

const loading = document.getElementById('loading');
const summaryList = document.getElementById('summary-list');

async function loadBoardSummary() {
  try {
    // Get all lists and cards on the board
    // Note: t.cards('all') returns all visible (non-archived) cards in open lists
    const lists = await t.lists('all');
    const cards = await t.cards('all');

    // Create a map to store sums for each list
    const listSummaries = new Map();

    // Process all cards and sum up their values by list
    for (const card of cards) {
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
      summaryList.innerHTML = '<div class="no-data">No cards with data</div>';
    } else {
      summaryList.innerHTML = '';

      listSummaries.forEach((summary) => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';

        listItem.innerHTML = `
          <div class="list-name">${summary.name}</div>
          <div class="badges">
            <div class="badge estimation-badge">
              <img src="./images/estimation.png" class="badge-icon" alt="Estimation">
              <span class="badge-text">${summary.estimation.toFixed(1)}</span>
            </div>
            <div class="badge delivered-badge">
              <img src="./images/delivered.png" class="badge-icon" alt="Delivered">
              <span class="badge-text">${summary.delivered.toFixed(1)}</span>
            </div>
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
