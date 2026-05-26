// Stuff for each entry in the file tree / search list

export function updateCheckbox(element) {
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

export function updateCheckboxById(id, isChecked) {
  const treeElement = document.getElementById("bookmark-tree");
  const entry = treeElement.querySelector(`#${id}`);
  entry.querySelector("input").checked = isChecked;
  updateCheckbox(entry);
}
