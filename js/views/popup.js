// Popup view controller
const t = window.TrelloPowerUp.iframe();

const estimationInput = document.getElementById('estimation');
const deliveredInput = document.getElementById('delivered');
const saveBtn = document.getElementById('save-btn');
const removeBtn = document.getElementById('remove-btn');

// Handle estimation button clicks
document.querySelectorAll('.est-btn').forEach(button => {
  button.addEventListener('click', function() {
    estimationInput.value = this.dataset.value;
  });
});

// Handle save button
saveBtn.addEventListener('click', async function() {
  const estimation = parseFloat(estimationInput.value) || 0;
  const delivered = parseFloat(deliveredInput.value) || 0;

  await t.set('card', 'shared', 'taskData', {
    estimation: estimation,
    delivered: delivered
  });

  t.closePopup();
});

// Handle remove button
removeBtn.addEventListener('click', async function() {
  await t.remove('card', 'shared', 'taskData');
  t.closePopup();
});

// Load existing data
t.get('card', 'shared', 'taskData').then(function(taskData) {
  if (taskData) {
    estimationInput.value = taskData.estimation || '';
    deliveredInput.value = taskData.delivered || '';
  }
});
