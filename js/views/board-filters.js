const t = window.TrelloPowerUp.iframe();

async function loadFilters() {
  const filters = await t.get('board', 'shared', 'summaryFilters');
  return filters || { cardName: '', selectedUsers: [] };
}

async function loadUsers() {
  const members = await t.board('members');
  const usersList = document.getElementById('users-list');
  const currentFilters = await loadFilters();

  usersList.innerHTML = '';

  members.forEach(member => {
    const div = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `user-${member.id}`;
    checkbox.value = member.id;
    checkbox.checked = currentFilters.selectedUsers.includes(member.id);

    const label = document.createElement('label');
    label.htmlFor = `user-${member.id}`;
    label.textContent = member.fullName || member.username;

    div.appendChild(checkbox);
    div.appendChild(label);
    usersList.appendChild(div);
  });
}

async function loadCurrentFilters() {
  const filters = await loadFilters();
  document.getElementById('card-name-filter').value = filters.cardName || '';
}

document.getElementById('apply-filters').addEventListener('click', async function() {
  const cardName = document.getElementById('card-name-filter').value;
  const checkboxes = document.querySelectorAll('#users-list input[type="checkbox"]:checked');
  const selectedUsers = Array.from(checkboxes).map(cb => cb.value);

  await t.set('board', 'shared', 'summaryFilters', {
    cardName: cardName,
    selectedUsers: selectedUsers
  });

  if (window.opener) {
    window.opener.postMessage({ type: 'filtersUpdated' }, '*');
  }

  t.closePopup();
});

document.getElementById('clear-filters').addEventListener('click', async function() {
  await t.set('board', 'shared', 'summaryFilters', {
    cardName: '',
    selectedUsers: []
  });

  if (window.opener) {
    window.opener.postMessage({ type: 'filtersUpdated' }, '*');
  }

  t.closePopup();
});

t.render(function() {
  loadUsers();
  loadCurrentFilters();
});
