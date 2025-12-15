export async function downloadBookmarks(bookmarks) {
	if (bookmarks.length > 1) {
		asyndownloadBatch(bookmarks);
	} else if (bookmarks.length === 1) {
		downloadSingle(bookmarks[0]);
	}
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

function downloadSingle(bookmark) {
	const blob = new Blob([bookmarkToString(bookmark)], {
		type: "application/octet-stream",
	});
	const url = URL.createObjectURL(blob);
	const filename = `${bookmark.title}.desktop`.replace("/", "");

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

async function downloadBatch(bookmarks) {
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
