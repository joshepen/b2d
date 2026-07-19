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
  // TODO add snake case
  const bookmarks = document
    .getElementById("bookmark-tree")
    .querySelectorAll("div.bookmark-item:has( > input:checked)");
  const numBookmarks = bookmarks.length;

  if (numBookmarks == 1) {
    downloadSingle(bookmarks[0]);
  } else if (numBookmarks > 1) {
    const structured = (await chrome.storage.local.get("keep-dir-structure"))[
      "keep-dir-structure"
    ];
    await downloadBatch(structured);
  }
  // Do nothing if number of bookmarks < 1
}

function downloadSingle(bookmark) {
  const blob = new Blob([bookmarkToString(bookmark)], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const filename = getFilename(bookmark);

  chrome.downloads.download(
    {
      url,
      filename,
    },
    () => {
      URL.revokeObjectURL(url);
    },
  );
}

function zipFile(zip, bookmark, dir) {
  const s = bookmarkToString(bookmark);
  const filename = getFilename(bookmark, dir);
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
  const items = folderElement.querySelectorAll(
    ":scope > .bookmark-item:has(> input:checked)",
  );

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

function getFilename(bookmark, dir) {
  return `${dir ?? ""}${bookmark.querySelector(":scope > label").textContent.replaceAll("/", "")}.desktop`;
}
