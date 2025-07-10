// Accessible tabbed navigation for journal info and articles
(function() {
  function setupTabs(tabNavSelector, tabPanelSelector) {
    const tabNav = document.querySelector(tabNavSelector);
    if (!tabNav) return;
    const tabButtons = tabNav.querySelectorAll('button[role="tab"]');
    const tabPanels = document.querySelectorAll(tabPanelSelector);

    function activateTab(tab) {
      tabButtons.forEach(btn => {
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tabPanels.forEach(panel => {
        panel.hidden = true;
      });
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) panel.hidden = false;
      tab.focus();
    }

    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => activateTab(btn));
      btn.addEventListener('keydown', e => {
        let newIdx = idx;
        if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabButtons.length;
        else if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
        else if (e.key === 'Home') newIdx = 0;
        else if (e.key === 'End') newIdx = tabButtons.length - 1;
        else return;
        e.preventDefault();
        activateTab(tabButtons[newIdx]);
      });
    });
    // Activate first tab by default
    activateTab(tabButtons[0]);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupTabs('.journal-tabs-nav', '.journal-tab-panel');
    setupTabs('.articles-tabs-nav', '.tab-content');
  });
})(); 