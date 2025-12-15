export async function downloadBookmarks(bookmarks) {
  const zip = new JSZip();
  bookmarks.forEach((bookmark) => {
    const s = bookmarkToString(bookmark);
    const filename = `${bookmark.title}.desktop`.replace("/", "");
    zip.file(filename, s);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: "desktop-files.zip" }, () => {
    URL.revokeObjectURL(url);
  });
}

function bookmarkToString(bookmark) {
  const entries = {
    Name: bookmark.title,
    Exec: `xdg-open ${bookmark.url}`,
    Type: "Application",
    Categories: "Web;",
  };
  let text = "[Desktop Entry]";
  Object.keys(entries).forEach((k) => {
    text += `\n${k}=${entries[k]}`;
  });
  return text;
}
