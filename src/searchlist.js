import { updateCheckboxById } from "./bookmarks.js";
const treeElement = document.getElementById("bookmark-tree");
const searchListElement = document.getElementById("search-results-list");
const searchBarElement = document.getElementById("search-bar");

export function initSearchBar() {
  searchBarElement.addEventListener("input", () => {
    setSearchMode(searchBarElement.value != "");
    updateSearchList(searchBarElement.value);
  });
}

function setSearchMode(inSearchMode) {
  searchListElement.style.display = inSearchMode ? "block" : "none";
  treeElement.style.display = inSearchMode ? "none" : "block";
}

function updateSearchList(searchTerm) {
  searchListElement.innerHTML = "";
  let labels = treeElement.querySelectorAll("label");
  labels.forEach((label) => {
    if (label.textContent.includes(searchTerm)) {
      let wrapperDiv = label.parentElement.cloneNode(true);
      wrapperDiv.addEventListener("click", () => {
        const originalDiv = treeElement.querySelector(
          `[id="${wrapperDiv.id}"]`,
        );
        originalDiv.click();

        wrapperDiv.querySelector("input").checked =
          originalDiv.querySelector("input").checked;
      });

      searchListElement.appendChild(wrapperDiv);
    }
  });
}
