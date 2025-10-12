// Popup view controller
const t = window.TrelloPowerUp.iframe();

// Handle size button clicks
document.querySelectorAll('.size-btn').forEach(button => {
  button.addEventListener('click', async function() {
    const size = this.dataset.size;

    // Store the task size on the card
    await t.set('card', 'shared', 'taskSize', size);

    // Close the popup
    t.closePopup();
  });
});

// Load and display current task size if it exists
t.get('card', 'shared', 'taskSize').then(function(taskSize) {
  if (taskSize) {
    document.querySelectorAll('.size-btn').forEach(button => {
      if (button.dataset.size === taskSize) {
        button.classList.add('selected');
      }
    });
  }
});
