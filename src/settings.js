export function initSettings() {
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
  document.querySelectorAll("input.setting").forEach((element) => {
    element.addEventListener("change", (e) => {
      chrome.storage.local.set({ [e.target.id]: e.target.checked });
    });
  });
}
