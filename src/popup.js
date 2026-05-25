import { getBookmarks } from "./bookmarks.js";
import { downloadBookmarks } from "./download.js";

let bookmarks = await chrome.bookmarks.getTree();
if (bookmarks.length == 1) {
  bookmarks = bookmarks[0].children;
}
const treeElement = document.getElementById("bookmark-tree");

displayList(treeElement, bookmarks);

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    document.body.style.height = "auto";
    document.body.style.height = document.body.scrollHeight + "px";
  });
});

function displayList(parentElement, bookmarkList) {
  bookmarkList.forEach((bookmark) => {
    // For folders I want just the checkbox to be clickable, for leaves I want the whole thing
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style = "display: flex; gap: 4px; align-items: center";
    wrapperDiv.id = bookmark.id;
    parentElement.appendChild(wrapperDiv);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.style = "flex-shrink: 0; place-self: start; margin-top: 2px;";
    checkBox.checked = true;
    wrapperDiv.appendChild(checkBox);

    if (bookmark.children) {
      const details = document.createElement("details");
      details.style = "flex-grow: 1; margin-block: 4px";
      wrapperDiv.appendChild(details);

      const summary = document.createElement("summary");
      summary.textContent = bookmark.title;
      details.appendChild(summary);

      const childContainer = document.createElement("div");
      childContainer.style = "padding-left: 4px;";
      details.appendChild(childContainer);

      checkBox.addEventListener("click", () => {
        updateCheckboxes(wrapperDiv);
      });

      wrapperDiv.classList.add("bookmark-folder");

      displayList(childContainer, bookmark.children);
    } else {
      checkBox.style =
        "pointer-events: none; flex-shrink: 0; place-self: start; margin-top: 2px;";

      const label = document.createElement("label");
      label.textContent = bookmark.title;
      label.style = "flex-grow: 1; margin-block: 3px; overflow-x: hidden;";

      wrapperDiv.appendChild(label);

      wrapperDiv.addEventListener("click", () => {
        checkBox.checked = !checkBox.checked;
        updateCheckboxes(wrapperDiv);
      });

      wrapperDiv.classList.add("bookmark-item");
    }
  });
}

function updateCheckboxes(element) {
  // TODO propogate up the folder select status
  const isChecked = element.querySelector("input").checked;
  if (element.className.includes("bookmark-folder")) {
    const childBookmarks = element.querySelectorAll(
      ".bookmark-item, .bookmark-folder",
    );
    childBookmarks.forEach((bookmarkElement) => {
      bookmarkElement.querySelector("input").checked = isChecked;
    });
  }
}
