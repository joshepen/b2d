import { getSelectedBookmarkIds, getBookmarkById } from "./filetree.js";
import { bookmarkToString } from "./bookmark-utils.js";

export function initDownloadButton() {
  const button = document.getElementById("download");
  button.addEventListener("click", async () => {
    const ids = getSelectedBookmarkIds();
    const treeElement = document.getElementById("bookmark-tree");
    // const selectedBookmarks = ids.map((id) => getBookmarkById(id, bookmarks));
    await downloadBookmarks();
  });
}
async function downloadBookmarks() {
  // TODO re-add download single. probably split up download and zip making
  // TODO add option for structured or not
  await downloadBatchStructured();
}

// function downloadSingle(bookmark) {
//   const blob = new Blob([bookmarkToString(bookmark)], {
//     type: "application/octet-stream",
//   });
//   const url = URL.createObjectURL(blob);
//   const filename = `${bookmark.title}.desktop`.replace("/", "");
//
//   chrome.downloads.download(
//     {
//       url,
//       filename,
//     },
//     () => {
//       URL.revokeObjectURL(url);
//     },
//   );
// }

function zipFile(zip, dir, bookmark) {
  const s = bookmarkToString(bookmark);
  const filename = `${dir}/${bookmark.querySelector(":scope > label").textContent.replaceAll("/", "")}.desktop`;
  zip.file(filename, s);
}

async function downloadBatchStructured() {
  const treeElement = document.getElementById("bookmark-tree");
  const zip = new JSZip();
  await createZipStructured(zip, "desktop-files/", treeElement);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: "desktop-files.zip" }, () => {
    URL.revokeObjectURL(url);
  });
}
async function createZipStructured(zip, dir, folderElement) {
  const items = folderElement.querySelectorAll(":scope > .bookmark-item");

  items.forEach((item) => {
    zipFile(zip, dir, item);
  });

  const folders = folderElement.querySelectorAll(":scope > .bookmark-folder");
  for (const folder of folders) {
    await createZipStructured(
      zip,
      dir +
        folder
          .querySelector("details > summary")
          .textContent.replaceAll("/", "") +
        "/",
      folder.querySelector("details > div"),
    );
  }
}
