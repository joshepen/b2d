import { createFileTree } from "./filetree.js";
import { initSearchBar } from "./searchlist.js";
import { initDownloadButton } from "./download.js";
import { initSettings } from "./settings.js";

let bookmarks = await chrome.bookmarks.getTree();
if (bookmarks.length == 1) {
  bookmarks = bookmarks[0].children;
}

const treeElement = document.getElementById("bookmark-tree");
createFileTree(treeElement, bookmarks);
initSearchBar();
initDownloadButton(bookmarks);
initSettings();
