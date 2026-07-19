export async function initSettings() {
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");

  settingsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = settingsPanel.style.display === "flex";
    settingsPanel.style.display = isOpen ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
      settingsPanel.style.display = "none";
    }
  });

  // Update stored values
  document.querySelectorAll("input.setting").forEach(async (element) => {
    const elementStatus = (await chrome.storage.local.get(element.id))[
      element.id
    ];
    if (elementStatus === undefined) {
      // Default to true first time
      chrome.storage.local.set({ [element.id]: true });
      element.checked = true;
    } else {
      element.checked = elementStatus;
    }
    element.addEventListener("change", async (e) => {
      await chrome.storage.local.set({ [e.target.id]: e.target.checked });
    });
  });
}
