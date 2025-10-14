// Board summary view controller
const t = window.TrelloPowerUp.iframe();

const loading = document.getElementById('loading');
const summaryList = document.getElementById('summary-list');

// TEST VERSION 1: Using specific fields
async function loadBoardSummaryV1() {
  console.log('Testing V1: t.lists(id, name) and t.cards(id, idList)');
  const lists = await t.lists('id', 'name');
  const cards = await t.cards('id', 'idList');
  return { lists, cards, version: 'V1' };
}

// TEST VERSION 2: Using 'all' parameter
async function loadBoardSummaryV2() {
  console.log('Testing V2: t.lists("all") and t.cards("all")');
  const lists = await t.lists('all');
  const cards = await t.cards('all');
  return { lists, cards, version: 'V2' };
}

// TEST VERSION 3: Using board() method with REST API
async function loadBoardSummaryV3() {
  console.log('Testing V3: t.board() to get board info');
  const board = await t.board('id', 'name', 'url');
  console.log('Board:', board);
  // Try to use REST API through board info
  return { board, version: 'V3 - check console for board info' };
}

// TEST VERSION 4: No parameters
async function loadBoardSummaryV4() {
  console.log('Testing V4: t.lists() and t.cards() with no parameters');
  const lists = await t.lists();
  const cards = await t.cards();
  return { lists, cards, version: 'V4' };
}

// TEST VERSION 5: Using getAll()
async function loadBoardSummaryV5() {
  console.log('Testing V5: t.getAll()');
  const allData = await t.getAll();
  console.log('All data:', allData);
  return { allData, version: 'V5 - check console' };
}

async function testVersion(versionFunc) {
  try {
    const result = await versionFunc();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function loadBoardSummary() {
  try {
    loading.style.display = 'none';
    summaryList.innerHTML = '<div class="testing">Testing all versions...</div>';

    // Test all versions
    const results = [];

    results.push({
      name: 'V1: t.lists("id", "name") and t.cards("id", "idList")',
      test: await testVersion(loadBoardSummaryV1)
    });

    results.push({
      name: 'V2: t.lists("all") and t.cards("all")',
      test: await testVersion(loadBoardSummaryV2)
    });

    results.push({
      name: 'V3: t.board("id", "name", "url")',
      test: await testVersion(loadBoardSummaryV3)
    });

    results.push({
      name: 'V4: t.lists() and t.cards() (no params)',
      test: await testVersion(loadBoardSummaryV4)
    });

    results.push({
      name: 'V5: t.getAll()',
      test: await testVersion(loadBoardSummaryV5)
    });

    // Display results
    summaryList.innerHTML = '';

    results.forEach((item) => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'test-result';

      const statusClass = item.test.success ? 'success' : 'failed';
      const statusText = item.test.success ? '✓ SUCCESS' : '✗ FAILED';

      let dataPreview = '';
      if (item.test.success) {
        const data = item.test.result;
        if (data.lists) {
          dataPreview += `<br><small>Lists: ${data.lists.length || 0} items</small>`;
        }
        if (data.cards) {
          dataPreview += `<br><small>Cards: ${data.cards.length || 0} items</small>`;
        }
        if (data.board) {
          dataPreview += `<br><small>Board: ${JSON.stringify(data.board)}</small>`;
        }
        if (data.allData) {
          dataPreview += `<br><small>All Data: Check console</small>`;
        }
      } else {
        dataPreview = `<br><small class="error-msg">Error: ${item.test.error}</small>`;
      }

      resultDiv.innerHTML = `
        <div class="test-header">
          <span class="test-status ${statusClass}">${statusText}</span>
          <span class="test-name">${item.name}</span>
        </div>
        <div class="test-data">${dataPreview}</div>
      `;

      summaryList.appendChild(resultDiv);
    });

    // Log all results to console for detailed inspection
    console.log('All test results:', results);

  } catch (error) {
    loading.style.display = 'none';
    summaryList.innerHTML = `<div class="error">Error running tests: ${error.message}</div>`;
    console.error('Error loading board summary:', error);
  }
}

// Load the summary when the popup opens
loadBoardSummary();
