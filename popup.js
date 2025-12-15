import { getBookmarks } from "./bookmarks.js";
import { downloadBookmarks } from "./download.js";
document.getElementById("download").onclick = async () => {
  const bookmarks = await getBookmarks();
  downloadBookmarks(bookmarks);
};
