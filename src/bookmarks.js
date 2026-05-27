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
