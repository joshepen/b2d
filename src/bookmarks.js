export async function getBookmarks() {
  const bookmarks = await chrome.bookmarks.getTree();

  return bookmarks;
}
