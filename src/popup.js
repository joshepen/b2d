import { createFileTree } from "./filetree.js";
import { initSearchBar } from "./searchlist.js";
import { initDownloadButton } from "./download.js";

let bookmarks = await chrome.bookmarks.getTree();
if (bookmarks.length == 1) {
  bookmarks = bookmarks[0].children;
}

const treeElement = document.getElementById("bookmark-tree");
createFileTree(treeElement, bookmarks);
initSearchBar();
initDownloadButton(bookmarks);
