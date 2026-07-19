import { SETTING_STRUCTURED_ID, SETTING_SNAKE_CASE_ID } from "./constants.js";
import { bookmarkToString } from "./bookmark-utils.js";

export function initDownloadButton() {
  const button = document.getElementById("download");
  button.addEventListener("click", async () => {
    await downloadBookmarks();
  });
}
async function downloadBookmarks() {
  const bookmarks = document
    .getElementById("bookmark-tree")
    .querySelectorAll("div.bookmark-item:has( > input:checked)");
  const numBookmarks = bookmarks.length;

  if (numBookmarks == 1) {
    downloadSingle(bookmarks[0]);
  } else if (numBookmarks > 1) {
    const structured = (await chrome.storage.local.get(SETTING_STRUCTURED_ID))[
      SETTING_STRUCTURED_ID
    ];
    await downloadBatch(structured);
  }
  // Do nothing if number of bookmarks < 1
}

async function downloadSingle(bookmark) {
  const blob = new Blob([bookmarkToString(bookmark)], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const filename = await getFilename(bookmark);

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

async function zipFile(zip, bookmark, dir) {
  const s = bookmarkToString(bookmark);
  const filename = await getFilename(bookmark, dir);
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

  for (const item of items) {
    await zipFile(zip, item, dir);
  }

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

async function getFilename(bookmark, dir) {
  let filename = `${dir ?? ""}${bookmark.querySelector(":scope > label").textContent.replaceAll("/", "")}.desktop`;
  if (
    (await chrome.storage.local.get(SETTING_SNAKE_CASE_ID))[
      SETTING_SNAKE_CASE_ID
    ]
  ) {
    // Ik this isn't real snake case but I'm not converting pascal or camel or whatever
    filename = filename.toLowerCase();
    filename = filename.replaceAll(" ", "_");
  }
  return filename;
}
