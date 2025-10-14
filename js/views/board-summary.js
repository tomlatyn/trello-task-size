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

// FILTER TEST VERSION 1: Get cards with all fields to check what's available
async function filterTestV1() {
  console.log('Filter Test V1: Get all card fields');
  const cards = await t.cards('all');
  console.log('Cards with all fields:', cards);
  return { cards, version: 'Filter V1 - check console for all card fields' };
}

// FILTER TEST VERSION 2: Get cards with closed field to filter archived
async function filterTestV2() {
  console.log('Filter Test V2: Filter by closed status');
  const cards = await t.cards('id', 'idList', 'closed', 'name');
  const openCards = cards.filter(card => !card.closed);
  console.log('Open cards only:', openCards);
  return { cards, openCards, version: 'Filter V2 - open cards only' };
}

// FILTER TEST VERSION 3: Get current context to see what filters are available
async function filterTestV3() {
  console.log('Filter Test V3: Check context');
  const context = await t.getContext();
  console.log('Context:', context);
  return { context, version: 'Filter V3 - check console for context' };
}

// FILTER TEST VERSION 4: Get member info to check current user
async function filterTestV4() {
  console.log('Filter Test V4: Get member info');
  const member = await t.member('all');
  console.log('Current member:', member);
  return { member, version: 'Filter V4 - check console for member info' };
}

// FILTER TEST VERSION 5: Get board with more fields
async function filterTestV5() {
  console.log('Filter Test V5: Get board with all fields');
  const board = await t.board('all');
  console.log('Board with all fields:', board);
  return { board, version: 'Filter V5 - check console for board fields' };
}

// FILTER TEST VERSION 6: Check if there's a visible property or filter state
async function filterTestV6() {
  console.log('Filter Test V6: Get cards and check for visible/filter properties');
  const cards = await t.cards('id', 'idList', 'closed', 'name', 'pos', 'badges');
  console.log('Cards with extended fields:', cards);

  // Try to access any filter-related methods
  let filterInfo = 'No filter methods found';
  if (typeof t.getFilter === 'function') {
    filterInfo = await t.getFilter();
  }
  console.log('Filter info:', filterInfo);

  return {
    cards,
    filterInfo,
    version: 'Filter V6 - check console for visible properties'
  };
}

// FILTER TEST VERSION 7: Try to get card visibility through context
async function filterTestV7() {
  console.log('Filter Test V7: Check card visibility through board state');
  const lists = await t.lists('id', 'name', 'closed');
  const openLists = lists.filter(list => !list.closed);
  const cards = await t.cards('id', 'idList', 'closed');
  const visibleCards = cards.filter(card =>
    !card.closed && openLists.some(list => list.id === card.idList)
  );
  console.log('Visible cards (open cards in open lists):', visibleCards);
  return {
    lists,
    openLists,
    cards,
    visibleCards,
    version: 'Filter V7 - open cards in open lists'
  };
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

    // Original API tests
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

    // Filter tests
    results.push({
      name: 'FILTER V1: Get all card fields',
      test: await testVersion(filterTestV1)
    });

    results.push({
      name: 'FILTER V2: Filter by closed status',
      test: await testVersion(filterTestV2)
    });

    results.push({
      name: 'FILTER V3: Check context',
      test: await testVersion(filterTestV3)
    });

    results.push({
      name: 'FILTER V4: Get member info',
      test: await testVersion(filterTestV4)
    });

    results.push({
      name: 'FILTER V5: Get board with all fields',
      test: await testVersion(filterTestV5)
    });

    results.push({
      name: 'FILTER V6: Check for visible/filter properties',
      test: await testVersion(filterTestV6)
    });

    results.push({
      name: 'FILTER V7: Open cards in open lists only',
      test: await testVersion(filterTestV7)
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
        if (data.openLists) {
          dataPreview += `<br><small>Open Lists: ${data.openLists.length || 0} items</small>`;
        }
        if (data.cards) {
          dataPreview += `<br><small>Cards: ${data.cards.length || 0} items</small>`;
        }
        if (data.openCards) {
          dataPreview += `<br><small>Open Cards: ${data.openCards.length || 0} items</small>`;
        }
        if (data.visibleCards) {
          dataPreview += `<br><small>Visible Cards: ${data.visibleCards.length || 0} items</small>`;
        }
        if (data.board) {
          dataPreview += `<br><small>Board: ${JSON.stringify(data.board)}</small>`;
        }
        if (data.context) {
          dataPreview += `<br><small>Context: ${JSON.stringify(data.context)}</small>`;
        }
        if (data.member) {
          dataPreview += `<br><small>Member: Check console</small>`;
        }
        if (data.allData) {
          dataPreview += `<br><small>All Data: Check console</small>`;
        }
        if (data.filterInfo) {
          dataPreview += `<br><small>Filter Info: ${JSON.stringify(data.filterInfo)}</small>`;
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
