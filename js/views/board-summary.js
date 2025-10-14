// Board summary view controller
const t = window.TrelloPowerUp.iframe();

const loading = document.getElementById('loading');
const summaryTable = document.getElementById('summary-table');
const summaryBody = document.getElementById('summary-body');

async function loadBoardSummary() {
  try {
    // Get only visible lists on the board (respects board filters)
    const lists = await t.lists('visible');

    // Get only visible cards on the board (respects board filters)
    const cards = await t.cards('visible');

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

    // Process all visible cards and sum up their values
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
    summaryTable.style.display = 'table';

    // Display the summary
    if (listSummaries.size === 0) {
      summaryBody.innerHTML = '<tr><td colspan="3" class="no-data">No lists found</td></tr>';
    } else {
      summaryBody.innerHTML = '';

      listSummaries.forEach((summary, listId) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="stack-name">${summary.name}</td>
          <td class="estimation-value">${summary.estimation.toFixed(1)}</td>
          <td class="delivered-value">${summary.delivered.toFixed(1)}</td>
        `;
        summaryBody.appendChild(row);
      });
    }

  } catch (error) {
    loading.style.display = 'none';
    summaryTable.style.display = 'table';
    summaryBody.innerHTML = `<tr><td colspan="3" class="error">Error loading summary: ${error.message}</td></tr>`;
    console.error('Error loading board summary:', error);
  }
}

// Load the summary when the popup opens
loadBoardSummary();
