import { updateCheckbox } from "./bookmark-utils.js";
/*
 * Format of filetree:
 * 	Bookmark:
 * 		<div><checkbox /><label /></div>
 * 	Bookmark folder:
 * 		<div><checkbox /><details><summary /><div with children /></details></div>
 */

export function createFileTree(parentElement, bookmarkList) {
  bookmarkList.forEach((bookmark) => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style = "display: flex; gap: 3px; align-items: center";
    wrapperDiv.id = bookmark.id;
    wrapperDiv.dataset.url = bookmark.url;
    parentElement.appendChild(wrapperDiv);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.style = "flex-shrink: 0; place-self: start; margin-top: 2px;";
    checkBox.checked = false;
    wrapperDiv.appendChild(checkBox);

    if (bookmark.children) {
      const details = document.createElement("details");
      details.style = "flex-grow: 1; margin-block: 3px";
      wrapperDiv.appendChild(details);

      const summary = document.createElement("summary");
      summary.textContent = bookmark.title;
      details.appendChild(summary);

      const childContainer = document.createElement("div");
      childContainer.style = "padding-left: 4px;";
      details.appendChild(childContainer);

      checkBox.addEventListener("click", () => {
        updateCheckbox(wrapperDiv);
      });

      wrapperDiv.classList.add("bookmark-folder");

      createFileTree(childContainer, bookmark.children);
    } else {
      checkBox.style =
        "pointer-events: none; flex-shrink: 0; place-self: start; margin-top: 2px;";

      const label = document.createElement("label");
      label.textContent = bookmark.title;
      label.style = "flex-grow: 1;";

      wrapperDiv.appendChild(label);

      wrapperDiv.addEventListener("click", () => {
        checkBox.checked = !checkBox.checked;
        updateCheckbox(wrapperDiv);
      });

      wrapperDiv.classList.add("bookmark-item");
    }
  });
}
