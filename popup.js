import { getBookmarks } from "./bookmarks.js";
document.getElementById("download").onclick = () => {
  let bookmarks = getBookmarks();
  console.log(bookmarks);
};
