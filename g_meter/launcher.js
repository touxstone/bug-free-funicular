const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxJQNa3Yeglyedoi7ziHyY9BrTUKFeinw2sDGB5HPJfOAteUYjVDxpniTnYY-hnuFiqCQ/exec';

const elements = {
  openApp: document.getElementById('openApp'),
  copyLink: document.getElementById('copyLink'),
  launcherStatus: document.getElementById('launcherStatus'),
  userGrid: document.getElementById('userGrid')
};

initLauncher();

function initLauncher() {
  const configured = isConfigured();

  elements.openApp.href = configured ? GAS_WEB_APP_URL : '#';
  elements.openApp.addEventListener('click', event => {
    if (!configured) {
      event.preventDefault();
      setStatus('Add the deployed GAS web-app URL in launcher.js first.', 'warning');
    }
  });

  elements.copyLink.addEventListener('click', copyAppLink);
  renderUserLinks(configured);

  if (!configured) {
    setStatus('Launcher is ready. Configure the GAS web-app URL after deployment.', 'warning');
  }
}

function renderUserLinks(configured) {
  elements.userGrid.innerHTML = '';

  for (let userId = 1; userId <= 10; userId += 1) {
    const link = document.createElement('a');
    link.textContent = 'User ' + userId;
    link.href = configured ? withUserParam(userId) : '#';
    link.addEventListener('click', event => {
      if (!configured) {
        event.preventDefault();
        setStatus('User shortcuts need the deployed GAS URL first.', 'warning');
      }
    });

    elements.userGrid.appendChild(link);
  }
}

function copyAppLink() {
  if (!isConfigured()) {
    setStatus('Add the deployed GAS web-app URL in launcher.js first.', 'warning');
    return;
  }

  navigator.clipboard
    .writeText(GAS_WEB_APP_URL)
    .then(() => setStatus('App link copied.', ''))
    .catch(() => setStatus('Could not copy the link from this browser.', 'warning'));
}

function withUserParam(userId) {
  const url = new URL(GAS_WEB_APP_URL);
  url.searchParams.set('userId', String(userId));
  return url.toString();
}

function isConfigured() {
  return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
    GAS_WEB_APP_URL
  );
}

function setStatus(message, type) {
  elements.launcherStatus.textContent = message;
  elements.launcherStatus.className = type ? 'status ' + type : 'status';
}
