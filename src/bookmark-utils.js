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

export function buildBookmarkMap(bookmarks, map = new Map()) {
  for (const b of bookmarks) {
    if (!b.children) map.set(b.id, b);
    else buildBookmarkMap(b.children, map);
  }
  return map;
}

export function bookmarkToString(bookmark) {
  const entries = {
    Name: bookmark.title,
    Exec: `xdg-open ${bookmark.url}`,
    Type: "Application",
    Categories: "Web;",
  };
  let text = "[Desktop Entry]";
  Object.keys(entries).forEach((k) => {
    text += `\n${k}=${entries[k]}`;
  });
  return text;
}
