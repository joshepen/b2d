import { getBookmarks } from "./bookmarks.js";
document.getElementById("download").onclick = async () => {
  let bookmarks = await getBookmarks();
  console.log(bookmarks);
};
