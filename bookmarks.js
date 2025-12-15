export async function getBookmarks() {
  const bookmarks = await chrome.bookmarks.getTree();
  const arr = [];
  treeToArr(bookmarks, arr);
  return arr;
}

function treeToArr(bookmarks, arr) {
  bookmarks.forEach((bookmark) => {
    // Check to remove folders and such
    if (bookmark.url) {
      arr.push(bookmark);
    }
    if (bookmark.children) {
      treeToArr(bookmark.children, arr);
    }
  });
}
