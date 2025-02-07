document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const saveButton = document.getElementById('save');

  browser.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
      checkboxes.forEach(checkbox => {
          checkbox.checked = settings[checkbox.id];
      });
  });

  saveButton.addEventListener('click', () => {
      const newSettings = {};
      checkboxes.forEach(checkbox => {
          newSettings[checkbox.id] = checkbox.checked;
      });

      browser.runtime.sendMessage({ action: 'updateSettings', settings: newSettings }, () => {
          browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              browser.tabs.sendMessage(tabs[0].id, { action: 'settingsUpdated', settings: newSettings });
          });
          window.close();
      });
  });
});
