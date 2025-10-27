// Popup view controller
const t = window.TrelloPowerUp.iframe();

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

const estimationInput = document.getElementById('estimation');
const deliveredInput = document.getElementById('delivered');
const saveBtn = document.getElementById('save-btn');
const removeBtn = document.getElementById('remove-btn');

// Function to save and close
async function saveAndClose() {
  const estimation = parseFloat(estimationInput.value) || 0;
  const delivered = parseFloat(deliveredInput.value) || 0;

  await t.set('card', 'shared', 'taskData', {
    estimation: estimation,
    delivered: delivered
  });

  t.closePopup();
}

// Handle estimation button clicks
document.querySelectorAll('.est-btn').forEach(button => {
  button.addEventListener('click', function() {
    estimationInput.value = this.dataset.value;
  });
});

// Handle Enter key on input fields
estimationInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveAndClose();
  }
});

deliveredInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveAndClose();
  }
});

// Handle save button
saveBtn.addEventListener('click', saveAndClose);

// Handle remove button
removeBtn.addEventListener('click', async function() {
  await t.remove('card', 'shared', 'taskData');
  t.closePopup();
});

// Load existing data and handle focus
t.get('card', 'shared', 'taskData').then(function(taskData) {
  if (taskData) {
    estimationInput.value = taskData.estimation || '';
    deliveredInput.value = taskData.delivered || '';
  }

  // Check for focus parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const focusField = urlParams.get('focus');

  // Set focus on the appropriate field with a small delay to ensure rendering is complete
  setTimeout(function() {
    if (focusField === 'estimation') {
      estimationInput.focus();
      estimationInput.select();
    } else if (focusField === 'delivered') {
      deliveredInput.focus();
      deliveredInput.select();
    }
  }, 100);
});
