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
  await downloadBatch(
    (await chrome.storage.local.get("keep-dir-structure"))[
      "keep-dir-structure"
    ],
  );
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

function zipFile(zip, bookmark, dir) {
  const s = bookmarkToString(bookmark);
  const filename = `${dir}${bookmark.querySelector(":scope > label").textContent.replaceAll("/", "")}.desktop`;
  zip.file(filename, s);
}

async function downloadBatch(structured) {
  const treeElement = document.getElementById("bookmark-tree");
  const zip = new JSZip();

  await createZip(zip, treeElement, "desktop-files/", structured);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: "desktop-files.zip" }, () => {
    URL.revokeObjectURL(url);
  });
}
async function createZip(zip, folderElement, dir, structured) {
  // TODO add checking if they're actually checked lol
  const items = folderElement.querySelectorAll(":scope > .bookmark-item");

  items.forEach((item) => {
    zipFile(zip, item, dir);
  });

  const folders = folderElement.querySelectorAll(":scope > .bookmark-folder");
  for (const folder of folders) {
    await createZip(
      zip,
      folder.querySelector("details > div"),
      structured
        ? dir +
            folder
              .querySelector("details > summary")
              .textContent.replaceAll("/", "") +
            "/"
        : dir,
      structured,
    );
  }
}
