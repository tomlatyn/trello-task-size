var Promise = window.TrelloPowerUp.Promise;
var t = window.TrelloPowerUp.iframe();

// Theme detection and application
function applyTheme() {
  var context = t.getContext();
  var theme = context ? (context.theme || context.initialTheme || 'light') : 'light';

  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Apply theme on load
applyTheme();

// Subscribe to theme changes
t.subscribeToThemeChanges(function(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

function loadFilters() {
  return t.get('board', 'shared', 'summaryFilters')
  .then(function(filters) {
    return filters || { cardName: '', selectedUsers: [] };
  });
}

function loadUsers() {
  var usersList = document.getElementById('users-list');

  usersList.innerHTML = '<div>Loading members...</div>';

  t.board('members')
  .then(function(boardData) {
    var members = boardData;

    if (boardData && boardData.members) {
      members = boardData.members;
    }

    return loadFilters().then(function(currentFilters) {
      usersList.innerHTML = '';

      if (!members || !Array.isArray(members) || members.length === 0) {
        usersList.innerHTML = '<div>No members found</div>';
        return;
      }

      members.forEach(function(member) {
        var div = document.createElement('div');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'user-' + member.id;
        checkbox.value = member.id;
        checkbox.checked = currentFilters.selectedUsers.includes(member.id);

        var label = document.createElement('label');
        label.htmlFor = 'user-' + member.id;
        label.textContent = member.fullName || member.username;

        div.appendChild(checkbox);
        div.appendChild(label);
        usersList.appendChild(div);
      });
    });
  })
  .catch(function(error) {
    console.error('Error loading users:', error);
    usersList.innerHTML = '<div>Error: ' + error.message + '</div>';
  });
}

function loadCurrentFilters() {
  loadFilters().then(function(filters) {
    document.getElementById('card-name-filter').value = filters.cardName || '';
  });
}

document.getElementById('apply-filters').addEventListener('click', function() {
  var cardName = document.getElementById('card-name-filter').value;
  var checkboxes = document.querySelectorAll('#users-list input[type="checkbox"]:checked');
  var selectedUsers = Array.prototype.slice.call(checkboxes).map(function(cb) {
    return cb.value;
  });

  t.set('board', 'shared', 'summaryFilters', {
    cardName: cardName,
    selectedUsers: selectedUsers
  })
  .then(function() {
    return t.back();
  });
});

document.getElementById('clear-filters').addEventListener('click', function() {
  t.set('board', 'shared', 'summaryFilters', {
    cardName: '',
    selectedUsers: []
  })
  .then(function() {
    document.getElementById('card-name-filter').value = '';
    var checkboxes = document.querySelectorAll('#users-list input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
    });
  });
});

t.render(function() {
  loadUsers();
  loadCurrentFilters();
});
