export async function initSettings() {
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");

  // TODO init settings button states to that of the storage states

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
    element.checked = (await chrome.storage.local.get(element.id))[element.id];
    element.addEventListener("change", async (e) => {
      console.log("FIRING");
      await chrome.storage.local.set({ [e.target.id]: e.target.checked });
      console.log(await chrome.storage.local.get(e.target.id));
    });
  });
}
